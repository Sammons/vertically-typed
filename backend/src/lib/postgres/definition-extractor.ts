/** Contributed by Ben Sammons */
import * as knex from "knex";
import * as _ from "lodash";
import * as fs from "fs";
import { Config } from "../../config";

class SchemaReader {
  constructor(private conn: knex) {}
  private denatureJsonType(table: string, column: string, type: string) {
    if (type.includes("json")) {
      return `${table}.${column}`;
    }
    return type;
  }
  private async columns(schema: string, kind: RelationKind) {
    let { rows } = await this.conn.raw(QueryColumns(kind, schema));
    return ((rows || []) as {
      [x: string]: string;
    }[]).map(
      ({
        comment,
        table_schema,
        table_name,
        column_name,
        column_default,
        type,
        nullable,
        ordinal_position
      }) => ({
        comment,
        table_schema,
        table_name,
        column_name,
        column_default,
        type: this.denatureJsonType(table_name, column_name, type),
        nullable,
        ordinal_position,
        kind
      })
    );
  }

  private async relations(schema: string) {
    let { rows } = await this.conn.raw(QueryForeignKeys(schema));
    return ((rows || []) as any[]).map(
      ({
        constraint_schema,
        constraint_name,
        referencing_table_schema,
        referencing_table_name,
        referencing_column_name,
        referenced_table_schema,
        referenced_table_name,
        referenced_column_name
      }) => ({
        constraint_schema,
        constraint_name,
        referencing_table_schema,
        referencing_table_name,
        referencing_column_name,
        referenced_table_schema,
        referenced_table_name,
        referenced_column_name
      })
    );
  }

  condense = (queryables: any[]) => {
    let queryable = {};
    queryables.forEach(q => {
      const tableDetails = {
        table_schema: q.table_schema,
        table_name: q.table_name
      };

      // namespaced by kind
      let kind = q.kind === RelationKind.table ? "table" : "view";
      _.set(
        queryable,
        `__schemas.${q.table_schema}.__${kind}.${q.table_name}.__`,
        tableDetails
      );
      _.set(
        queryable,
        `__schemas.${q.table_schema}.__${kind}.${q.table_name}.${
          q.column_name
        }`,
        q
      );

      // all together, but still by schema
      _.set(
        queryable,
        `__schemas.${q.table_schema}.${q.table_name}.__`,
        tableDetails
      );
      _.set(
        queryable,
        `__schemas.${q.table_schema}.${q.table_name}.${q.column_name}`,
        q
      );

      // mixed schemas
      _.set(queryable, `${q.table_schema}_${q.table_name}.__`, tableDetails);
      _.set(queryable, `${q.table_schema}_${q.table_name}.${q.column_name}`, q);
    });
    queryables.forEach(q => {
      if (q.nullable || q.column_default) {
        let kind = q.kind === RelationKind.table ? "table" : "view";
        _.set(
          queryable,
          `__schemas.${q.table_schema}.__${kind}.${q.table_name}.__.nullables.${
            q.column_name
          }`,
          q
        );
        _.set(
          queryable,
          `__schemas.${q.table_schema}.${q.table_name}.__.nullables.${
            q.column_name
          }`,
          q
        );
        _.set(
          queryable,
          `${q.table_schema}_${q.table_name}.__.nullables.${q.column_name}`,
          q
        );
      }
    });
    return queryable;
  };

  async scan(schema: string) {
    console.log("should be scanning schema", schema);
    let tableColumns = await this.columns(schema, RelationKind.table);
    let viewColumns = await this.columns(schema, RelationKind.view);
    let refs = await this.relations(schema);
    let queryables = _.union(tableColumns, viewColumns);
    let db = this.condense(queryables);

    _.set(db, "__relations", refs);

    await this.conn.destroy().thenReturn();

    return db;
  }
}

/**
 * https://www.postgresql.org/docs/9.3/static/catalog-pg-class.html
 * r = ordinary table,
 * i = index,
 * S = sequence,
 * v = view,
 * m = materialized view,
 * c = composite type,
 * t = TOAST table,
 * f = foreign table
 */
const RelationKind = {
  view: "v",
  table: "r"
};
type RelationKind = typeof RelationKind[keyof typeof RelationKind];

/** May need to extend this to get more attributes about columns,
 * such as who they reference, their default value, their
 */
const QueryColumns = (kind: RelationKind, schema: string) => `
select
	coalesce(
		pg_catalog.col_description(
			c.oid,
			col.ordinal_position
		),
		'no comment'
	) as comment,
	col.table_schema,
	c.relname as table_name,
	a.attname as column_name,
	pg_catalog.format_type(
		a.atttypid,
		a.atttypmod
	) as type,
	case
		when a.attnotnull then FALSE
		else TRUE
  end as nullable,
  col.ordinal_position,
	col.column_default
from
	pg_class c,
	pg_attribute a,
	pg_type t,
	information_schema.columns col
where
	c.relkind = '${kind}'
	and a.attnum > 0
	and a.attrelid = c.oid
	and a.atttypid = t.oid
	and relname in(
		select
			distinct table_name
		from
			information_schema.tables t
		where
      t.table_schema not in ('pg_catalog', 'information_schema') and
      t.table_schema in ('${schema || "public"}')
	)
	and table_name = c.relname
	and column_name = a.attname
order by
	table_name DESC, col.ordinal_position ASC;
`;

const QueryForeignKeys = (schema: string) =>
  `
select
tc.constraint_schema as constraint_schema,
  tc.constraint_name as constraint_name,
  tc.table_schema as referencing_table_schema,
  tc.table_name as referencing_table_name,
  kcu.column_name as referencing_column_name, 
  ccu.table_schema as referenced_table_schema, 
  ccu.table_name as referenced_table_name,
  ccu.column_name as referenced_column_name
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY' and tc.constraint_schema = '${schema}';
`;

export async function ExtractDefFromDB(connection: knex, schema: string) {
  const scannage = await new SchemaReader(connection).scan(schema);
  const def = JSON.stringify(scannage, null, 2)
    .replace(/(\:\ )(\".*\")(,?\n)/gm, "$1$2 as $2$3")
    .replace(/null\,/gm, "null as void,")
    .replace(/\[\]/gm, "[] as any[]");
  fs.writeFileSync("db.ts", `export const db = ${def}`);
}

ExtractDefFromDB(
  knex({
    client: "pg",
    connection: Config.pg
  }),
  "public"
)
  .then(() => {
    console.log("gen complete");
    process.exit();
  })
  .catch(e => {
    console.log("gen failed", e.message);
    process.exit(1);
  });

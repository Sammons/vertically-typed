// wrapper for tables
// use instead of knex
// for most things

type TypeMap = {
  // modify this to override tho type
  // observed coming out of the data layer
  uuid: string;
  jsonb: object;
  "character varying(255)": string;
  "timestamp without time zone": Date;
  "timestamp with time zone": Date;
  integer: number;
  text: string;
  bigint: number;
};

import { Diff, Omit, OneOf, Keys, Simplify } from "../lib/type-utils";
import * as knex from "knex";
import { db } from "./generated-db";
import * as _ from "lodash";
import { Config } from "../config";

const Conn = knex({
  client: "pg",
  connection: Config.pg
});

type ShapeOf<T extends { t: { shape: any } }> = T["t"]["shape"];
type HardShapeOf<
  T extends { t: { shape_noOptionals: any } }
> = T["t"]["shape_noOptionals"];
// type PartialOf<T extends {t: {shape: any}}> = Partial<T['t']['shape']>
type Sub = (subQuery: knex.QueryBuilder) => any;
type AllowComplexParams<T> = { [K in Keys<T>]: T[K] | Sub | T[K][] };
type Column = {
  comment: string;
  table_schema: string;
  table_name: string;
  column_name: string;
  column_default: string;
  type: keyof TypeMap;
  nullable: boolean;
  ordinal_position: number;
  kind: string;
};
type SampleTable<K extends string> = {
  __: {
    table_name: string;
    table_schema: string;
    nullables: { [x: string]: Column };
  };
} & { [Key in K]: Column };
type QueryOpts<T extends { t: { shape_noOptionals: any } }> = OneOf<
  AllowComplexParams<HardShapeOf<T>>
>;

class TableQueryBuilder<T extends AllTableNames> {
  constructor(public t: Table<T>, private k: knex) {}

  async delete(opts: QueryOpts<this>) {
    if (opts) {
      let q = this.k.del().from(this.t.schema + "." + this.t.name);
      this._applyComplexInclusiveQuery(opts, q);
      return await q;
    } else {
      throw new Error(`Empty opts in simplified delete`);
    }
  }

  async upsert(
    update: OneOf<HardShapeOf<this>>,
    where: QueryOpts<this>
  ): Promise<Simplify<ShapeOf<this>>> {
    if (update) {
      let row = await this.k.transaction((trx: knex.Transaction) => {
        return (async () => {
          let existsRows: {}[] = await trx
            .select(this.k.raw(`1`))
            .from(this.t.schema + "." + this.t.name)
            .where(where as {});
          if (existsRows.length > 0) {
            return this.update(where, update);
          } else {
            return this.insert(where);
          }
        })()
          .then(trx.commit)
          .catch(trx.rollback);
      });
      return row;
    } else {
      throw new Error(`Empty opts in simplified upsert`);
    }
  }

  async insert(
    opts: Simplify<ShapeOf<this>>
  ): Promise<Simplify<ShapeOf<this>>> {
    if (opts) {
      let rows = await this.k
        .insert(opts)
        .into(this.t.schema + "." + this.t.name)
        .returning("*");
      return rows[0];
    } else {
      throw new Error(`Empty opts in simplified insert`);
    }
  }

  async insertMultiple(
    ...opts: Simplify<ShapeOf<this>>[]
  ): Promise<ShapeOf<this>> {
    if (opts) {
      let rows = await this.k
        .insert(opts)
        .into(this.t.schema + "." + this.t.name)
        .returning("*");
      return rows;
    } else {
      throw new Error(`Empty opts in simplified bulk insert`);
    }
  }

  async update(
    where: QueryOpts<this>,
    update: OneOf<HardShapeOf<this>>
  ): Promise<Simplify<ShapeOf<this>>> {
    if (where) {
      let q = this.k
        .table(this.t.schema + "." + this.t.name)
        .update(update)
        .returning("*");
      this._applyComplexInclusiveQuery(where, q);
      return q;
    } else {
      throw new Error(`Empty opts in simplified update`);
    }
  }

  _applyComplexInclusiveQuery<T extends { [key: string]: any }>(
    opts: T,
    q: knex.QueryBuilder
  ) {
    const keys = _.keys(opts);
    const isFunc = (o: any): o is Sub => _.isFunction(o);
    const complexKeys = _.filter(keys, k => isFunc(opts[k]));
    const arrayKeys = _.filter(keys, k => Array.isArray(opts[k]));
    const simpleKeys = _.filter(
      keys,
      k => !isFunc(opts[k]) && !Array.isArray(opts[k])
    );
    if (complexKeys.length > 0) {
      complexKeys.map(k => opts[k]).forEach(subQuery => {
        if (isFunc(subQuery)) {
          q.where(qb => subQuery(qb));
        }
      });
    }
    if (arrayKeys.length > 0) {
      arrayKeys.map(k => {
        const values = opts[k];
        if (Array.isArray(values)) {
          q.whereIn(k, values);
        }
      });
    }
    if (simpleKeys.length > 0) {
      q.where(_.pick(opts, simpleKeys));
    }
  }

  async selectList(opts: QueryOpts<this>): Promise<Simplify<ShapeOf<this>>[]> {
    if (opts) {
      const q = this.k.table(this.t.schema + "." + this.t.name).select();
      this._applyComplexInclusiveQuery(opts, q);
      return await q;
    } else {
      throw new Error(`Empty opts in simplified select`);
    }
  }

  async selectFirst(opts: QueryOpts<this>): Promise<Simplify<ShapeOf<this>>> {
    return this.selectList(opts).then(r => r[0]);
  }
}

export class JoinQB<
  T extends Join<X, Y>,
  X extends AllTableNames,
  Y extends AllTableNames
> {
  constructor(private j: T, private k: knex) {}

  async where(opts: T["partialShape"]): Promise<T["shape"][]> {
    let binding = {};
    let whereSql = ``;
    Object.keys(opts).forEach(tablename => {
      let params = Object.keys((opts as any)[tablename]);
      for (let param of params) {
        let bind = `${tablename}___${param}`;
        (binding as any)[bind] = (opts as any)[tablename][param];
        let sql = ` ( "${tablename}"."${param}" = :${bind} ) `;
        if (whereSql.length === 0) {
          whereSql = sql;
        } else {
          whereSql += `AND ${sql}`;
        }
      }
    });

    let rows = await this.k
      .select(
        this.k.raw(
          `${this.j.x.columns
            .map(c => `"${this.j.x.name}"."${c}" as "${this.j.x.name}___${c}"`)
            .join(",")},${this.j.y.columns
            .map(c => `"${this.j.y.name}"."${c}" as "${this.j.y.name}___${c}"`)
            .join(",")}`
        )
      )
      .from(this.j.x.schema + "." + this.j.x.name)
      .leftJoin(
        this.j.y.schema + "." + this.j.y.name,
        this.j.x.colPrefixed[this.j.x1],
        this.j.y.colPrefixed[this.j.y1]
      )
      .where(this.k.raw(whereSql, binding as any));

    return rows.map((r: any) => {
      let allKeys = Object.keys(r);
      let res: { [K in TableName<X | Y>]: {} } = {} as any;
      res[this.j.x.name as TableName<X>] = {};
      res[this.j.y.name as TableName<Y>] = {};
      for (let k of allKeys) {
        let keyPieces = k.split("___");
        (res as any)[keyPieces[0]][keyPieces[1]] = r[k];
      }
      return res;
    });
  }
}

export class Join<X extends AllTableNames, Y extends AllTableNames> {
  constructor(
    public x: Table<X>,
    public y: Table<Y>,
    public x1: TableColumns<X>,
    public y1: TableColumns<Y>
  ) {}
  public shape = {} as { [V in X | Y]: TableShape<V> };
  public partialShape = {} as Partial<
    { [V in X | Y]: OneOf<Table<V>["shape_noOptionals"]> }
  >;
  public x_name = this.x.name;
  public y_name = this.y.name;
  get qb() {
    return new JoinQB<this, X, Y>(this, Conn);
  }
}

type AllTableNames = Keys<typeof db["__schemas"]["public"]["__table"]>;
type TableByName<
  N extends AllTableNames
> = typeof db["__schemas"]["public"]["__table"][N];

type TableColumns<N extends AllTableNames> = Diff<Keys<TableByName<N>>, "__">;
type TableNullables<N extends AllTableNames> = Keys<
  TableByName<N>["__"]["nullables"]
>;
type TableName<N extends AllTableNames> = TableByName<N>["__"]["table_name"];
type TableSchema<N extends AllTableNames> = TableByName<
  N
>["__"]["table_schema"];
type TableColumnType<
  N extends AllTableNames,
  C extends TableColumns<N>
> = TypeMap[TableByName<N>[C]["type"]];
type TableShape<N extends AllTableNames> = Simplify<
  Omit<{ [K in TableColumns<N>]: TableColumnType<N, K> }, TableNullables<N>> &
    { [K in TableColumns<N>]?: TableColumnType<N, K> }
>;
type TableShapeAllRequired<N extends AllTableNames> = Simplify<
  { [K in TableColumns<N>]: TableColumnType<N, K> }
>;

class Table<T extends AllTableNames> {
  columns: TableColumns<T>[] = [];
  shape: TableShape<T>;
  shape_noOptionals: TableShapeAllRequired<T>;
  col: Simplify<{ [K in TableColumns<T>]: K }> = {} as any;
  colPrefixed: Simplify<{ [K in TableColumns<T>]: K }> = {} as any;
  name: TableName<T> = this.shapeDef.__.table_name;
  schema: TableSchema<T> = this.shapeDef.__.table_schema;
  get qb() {
    return new TableQueryBuilder<T>(this, Conn);
  }
  constructor(private shapeDef: TableByName<T>) {
    let keys = Object.keys(shapeDef);
    for (let k of keys) {
      if (k === "__") {
        continue;
      }
      this.columns.push(k as TableColumns<T>);
      this.col[k] = k;
      this.colPrefixed[k] = this.name + "." + k;
    }
  }
}

const TableNames = Keys(db.__schemas.public.__table);

const Tables: { [K in AllTableNames]: Table<K> } = {} as any;

TableNames.forEach((name: string) => {
  (Tables as any)[name] = new Table((db as any).__schemas.public.__table[name]);
});

export { Tables, Table };

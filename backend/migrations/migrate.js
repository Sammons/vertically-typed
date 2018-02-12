const knex = require("knex");

const conn = knex({
  client: "pg",
  connection: {
    ssl: false,
    database: "sample",
    host: "localhost",
    port: 5432,
    user: "sample",
    password: "sample"
  }
});

conn.migrate
  //.rollback
  .latest({
    directory: "./migrations/changesets"
  })
  .then(() => {
    console.log("migration completed");
    process.exit(0);
  })
  .catch(e => {
    console.log("migration failed", e.message);
    process.exit(1);
  });

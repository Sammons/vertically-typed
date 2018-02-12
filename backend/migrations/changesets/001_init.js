const fs = require("fs");

module.exports.up = knex => {
  const sql = fs.readFileSync(__dirname + "/001_init_up.sql").toString();
  return knex.raw(sql);
};

module.exports.down = knex => {
  const sql = fs.readFileSync(__dirname + "/001_init_down.sql").toString();
  return knex.raw(sql);
};

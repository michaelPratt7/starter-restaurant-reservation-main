const knex = require ("../db/connection");

function list() {
    return knex("tables")
        .orderBy("table_name", "asc")
        .select("*");
}

async function create(table) {
    const CreateTables = await knex("tables")
        .insert(table, "*");
        return CreateTables[0];
}

async function read(reservationId, tableId) {
    return knex("tables")
    .where({ "table_id": tableId, "reservation_id": reservationId })
  }

async function update(reservationId, tableId) {
    return knex("tables")
          .where({ "table_id": tableId })
          .update({ "reservation_id": reservationId })
          .returning("*");
  }

module.exports = {
    list,
    create,
    read,
    update,
}
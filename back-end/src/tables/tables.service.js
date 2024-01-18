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

async function readTable(tableId) {
    return knex("tables")
    .where({ "table_id": tableId})
    .first();
  }

async function readResId(reservationId) {
    return knex("tables")
        .where({"reservation_id": reservationId})
        .first();
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
    readTable,
    readResId,
    update,
}
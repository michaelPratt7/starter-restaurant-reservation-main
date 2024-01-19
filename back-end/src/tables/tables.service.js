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

function readTable(tableId) {
    return knex("tables")
    .select("*")
    .where({ "table_id": tableId})
    .first();
  }

function readResId(reservationId) {
    return knex("reservations")
        .select("*")
        .where({"reservation_id": reservationId})
        .first();
}

function update(reservationId, tableId) {
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
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

async function destroy(reservationId, tableId) {
    const trx = await knex.transaction();
    let updatedTable = {}
    return trx("reservations")
        .where({reservationId})
        .update({status: "finished"})
        .then(() => 
            trx("tables")
                .where({tableId})
                .update({reservationId: null}, "*")
                .then((results) => (updatedTable = results[0]))
        )
        .then(trx.commit)
        .then(() => updatedTable)
        .catch(trx.rollback)
}

module.exports = {
    list,
    create,
    readTable,
    readResId,
    update,
    destroy,
}
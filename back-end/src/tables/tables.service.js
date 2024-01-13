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

module.exports = {
    list,
    create,
}
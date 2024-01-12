const knex = require ("../db/connection");

async function create(table) {
    const CreateTables = await knex("tables")
        .insert(table, "*");
        return CreateTables[0];
}

module.exports = {
    create,
}
const knex = require ("../db/connection");

function list(date) {
    return knex("reservations")
        .whereRaw("DATE(reservation_date) = ?", [date])
        .orderBy("reservation_time", "asc")
        .select("*");
}

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
}

module.exports = {
    list,
    create,
}
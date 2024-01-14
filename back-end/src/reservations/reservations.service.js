const knex = require ("../db/connection");

function list(date) {
    return knex("reservations")
        .whereRaw("DATE(reservation_date) = ?", [date])
        .orderBy("reservation_time", "asc")
        .select("*");
}

async function create(reservation) {
    const CreateReservations = await knex("reservations")
        .insert(reservation, "*");
        return CreateReservations[0];
}

async function read(reservationId) {
    return knex("reservations")
        .select("*")
        .where("reservation_id", reservationId)
        .first()
}

module.exports = {
    list,
    create,
    read,
}
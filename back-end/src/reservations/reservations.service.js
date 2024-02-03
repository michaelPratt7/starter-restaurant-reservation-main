const knex = require ("../db/connection");

function list(date) {
    return knex("reservations")
        .whereRaw("DATE(reservation_date) = ?", [date])
        .whereNotIn("status", ["finished"])
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

async function update(reservationId, status) {
    return knex("reservations")
        .where({ "reservation_id": reservationId})
        .update({"status": status})
        .returning("*")
}

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

module.exports = {
    list,
    create,
    read,
    update,
    search,
}
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

async function statusUpdate(reservationId, status) {
    return knex("reservations")
        .where({ "reservation_id": reservationId})
        .update({"status": status})
        .returning("*")
}

async function cancelStatusUpdate(reservationId) {
    //how do i add an update for status: cancelled as a PUT request along the same route as another PUT request
}

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

function resUpdate(updatedRes) {
    return knex("reservations")
        .select("*")
        .where({"reservation_id": updatedRes.reservation_id})
        .update(updatedRes, "*")
        .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
    list,
    create,
    read,
    statusUpdate,
    search,
    resUpdate,
}
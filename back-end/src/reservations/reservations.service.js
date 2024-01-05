const knex = require ("../db/connection");

function list(date) {
    return knex('reservations').whereRaw('DATE(reservation_date) = ?', [date]).select('*');
}

module.exports = {
    list,
}
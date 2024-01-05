const fs = require('fs');
const path = require('path');

exports.seed = function (knex) {
  return knex
  .raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
  .then(function () {
    const filePath = path.join(__dirname, '00-reservations.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);
    return knex('reservations').insert(data)
  })
};

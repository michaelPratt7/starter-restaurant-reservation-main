const fs = require('fs');
const path = require('path');

exports.seed = function (knex) {
  return knex
  .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
  .then(function () {
    const filePath = path.join(__dirname, '00-tables.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);
    return knex('tables').insert(data)
  })
};
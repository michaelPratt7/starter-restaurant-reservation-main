const service = require ("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function create(req, res) {
    service
      .create(req.body.data)
      .then((data) => res.status(201).json({ data }));
  }

module.exports = {
    create: [asyncErrorBoundary(create)],
}
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");



/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({data: await service.list(req.query.date)});
}

function create(req, res) {
  service
    .create(req.body.data)
    .then((data) => res.status(201).json({ data }));
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({
      status: 400,
      message: `Order must include a ${propertyName}` 
  });
  };
}

function propertyIsNotEmpty(propertyName) {
  return function (req, res, next) {
  const {data = {}} = req.body;
  if (data[propertyName] == "") {
      return next ({
          status: 400,
          message: `Order must include a ${propertyName}`
      })
  };
  next();
  };
}

function reservationDateIsValid() {
  return function (req, res, next) {
  const reservationDate = new Date(req.body.reservation_date);

    if (isNaN(reservationDate.getTime())) {
      return res.status(400).json({ error: 'Invalid reservation_date format' });
    }
    next();
  }
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    reservationDateIsValid,
    propertyIsNotEmpty("first_name"),
    propertyIsNotEmpty("last_name"),
    propertyIsNotEmpty("reservation_date"),
    propertyIsNotEmpty("reservation_time"),
    propertyIsNotEmpty("people"),
    asyncErrorBoundary(create),
  ],

};

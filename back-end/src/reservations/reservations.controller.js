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

function reservationDateIsValid(req, res, next) {
  const dateFormat = /^\d{4}\-\d{1,2}\-\d{1,2}$/;
  const {reservation_date} = req.body.data;

  if (!reservation_date.match(dateFormat)) {
    return next({
      status: 400,
      message: `reservation_date is invalid`,
    });
}
next();
}

function reservationTimeIsValid(req, res, next) {
  const timeFormat = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  const {reservation_time} = req.body.data;

  if(!reservation_time.match(timeFormat)) {
    return next({
      status: 400,
      message: `reservation_time is invalid`
    });
  }
  next();
}

function peopleIsValidNumber(req, res, next) {
  const { data: { people }  = {} } = req.body;
    if (people <= 0 || !Number.isInteger(people)) {
        return next({
            status: 400,
            message: "Reservation must have a people value that is an integer greater than 0"
        });
    }
    next();
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
    reservationTimeIsValid,
    peopleIsValidNumber,
    propertyIsNotEmpty("first_name"),
    propertyIsNotEmpty("last_name"),
    propertyIsNotEmpty("reservation_date"),
    propertyIsNotEmpty("reservation_time"),
    propertyIsNotEmpty("people"),
    asyncErrorBoundary(create),
  ],

};

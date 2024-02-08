const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");



/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const mobile_number = req.query.mobile_number
  if(mobile_number) {
    res.json({data: await service.search(mobile_number)});
  } else {
    res.json({data: await service.list(req.query.date)});
  } 
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
      message: `Reservation must include a ${propertyName}` 
  });
  };
}

function propertyIsNotEmpty(propertyName) {
  return function (req, res, next) {
  const {data = {}} = req.body;
  if (data[propertyName] == "") {
      return next ({
          status: 400,
          message: `${propertyName} variable of a reservation must not be empty`
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

function resDateIsInFuture(req, res, next) {
  const {reservation_date} = req.body.data;
  const selectedDate = new Date(reservation_date);
  const currentDate = new Date();

  if (selectedDate < currentDate) {
    return next ({
      status: 400,
      message: `reservation date has to be in the future`
    });
  }
  next();
}

function resDateisOnTues(req, res, next) {
  const {reservation_date} = req.body.data;

  if (new Date(reservation_date).getUTCDay() === 2) {
    return next ({
      status: 400,
      message: `reservation date can't be made on a day restaurant is closed`
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

function resTimeDuringBusiness(req, res, next) {
  const {reservation_time} = req.body.data;
  const resTime = new Date(`2000-01-01T${reservation_time}`)
  const openingTime = new Date(`2000-01-01T10:30:00`);
  const closingTime = new Date(`2000-01-01T21:30:00`);

  if (resTime < openingTime || resTime > closingTime) {
    return next({
      status: 400,
      message: `reservation time must be within business hours`
    })
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

async function reservationExists(req, res, next) {
  const {reservation_id} = req.params;
  const parsedReservationId = parseInt(reservation_id, 10);
  const reservation = await service.read(parsedReservationId);
  if(reservation) {
      res.locals.reservation = reservation;
      return next();
  }
  return next({
      status: 404,
      message: `Reservation ${reservation_id} cannot be found`,
  });
}

async function read(req, res, next) {
  const {reservation: data} = res.locals;
  res.json({data});
}

function resStatusValidity(req, res, next) {
  const { data: { status }  = {} } = req.body;
  if(status === "seated" || status === "finished") {
    return next ({
      status: 400,
      message: "Reservation status can't be seated or finished"
    })
  }
  return next();
}

async function statusUpdate(req, res, next) {
  const {reservation_id} = res.locals.reservation;
  const { data: { status }  = {} } = req.body;
    if(['booked', 'seated', 'finished', 'cancelled'].includes(status)) {
      await service.statusUpdate(reservation_id, status)
      res.status(200).json({ data: {status: status}});
    }
  } 


function cantChangeFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if(status === "finished") {
    return next({
      status:400,
      message:"You can't change the status of an already finished reservation"
    })
  }
  return next();
}

function statusValidity(req, res, next) {
  const { data: { status }  = {} } = req.body;
  if (status === "unknown") {
    return next({
      status:400,
      message: "Status can't be unknown"
    })
  }
  return next();
}

async function resUpdate(req, res, next) {
  const updatedRes = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  res.json({ data: await service.resUpdate(updatedRes)});
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
    resDateIsInFuture,
    resDateisOnTues,
    reservationTimeIsValid,
    resTimeDuringBusiness,
    peopleIsValidNumber,
    propertyIsNotEmpty("first_name"),
    propertyIsNotEmpty("last_name"),
    propertyIsNotEmpty("reservation_date"),
    propertyIsNotEmpty("reservation_time"),
    propertyIsNotEmpty("people"),
    resStatusValidity,
    asyncErrorBoundary(create),
  ],
  read: [reservationExists, asyncErrorBoundary(read)],
  statusUpdate: [
    reservationExists,
    cantChangeFinished,
    statusValidity,
    asyncErrorBoundary(statusUpdate),
  ],
  search: [asyncErrorBoundary(list)],
  resUpdate: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    propertyIsNotEmpty("first_name"),
    propertyIsNotEmpty("last_name"),
    propertyIsNotEmpty("reservation_date"),
    propertyIsNotEmpty("reservation_time"),
    propertyIsNotEmpty("people"),
    propertyIsNotEmpty("mobile_number"),
    reservationDateIsValid,
    reservationTimeIsValid,
    peopleIsValidNumber,
    reservationExists,
    asyncErrorBoundary(resUpdate),
  ],

};

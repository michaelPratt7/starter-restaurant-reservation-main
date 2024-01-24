const service = require ("./tables.service");
const resService = require ("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  res.json({data: await service.list()});
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
        message: `Table must include a ${propertyName}` 
    });
    };
  }

  function propertyIsNotEmpty(propertyName) {
    return function (req, res, next) {
    const {data = {}} = req.body;
    if (data[propertyName] == "") {
        return next ({
            status: 400,
            message: `${propertyName} variable of a table must not be empty`
        })
    };
    next();
    };
  }

  function capacityIsValidNumber(req, res, next) {
    const { data: { capacity }  = {} } = req.body;
    console.log(capacity)
      if (capacity <= 0 || !Number.isInteger(capacity)) {
          return next({
              status: 400,
              message: "Table must have a capacity value that is an integer greater than 0"
          });
      }
      next();
  }

  function tableNameLength(req, res, next) {
    const { data: { table_name } = {} } = req.body;
    if (table_name.length === 1) {
      return next({
        status: 400,
        message: "table_name variable must be longer than one character"
      });
    }
    next();
  }

  async function reservationIdExists(req, res, next) {
    const { reservation_id } = req.body.data;
    const reservation = await resService.read(reservation_id);
    if (reservation) {
      res.locals.reservation = reservation;
      return next();
    }
    next({
      status: 404,
      message: `${reservation_id} does not exist`
    });
  }

  async function tableIdExists(req, res, next) {
    const {table_id} = req.params;
    const table = await service.readTable(table_id);
    if(table) {
      res.locals.table = table;
      return next();
    }
    return next({
      status: 404,
      message: `Table ID: ${table_id} cannot be found`
    });
  }

  async function validCapacity(req, res, next) {
    const table = res.locals.table;
    const reservation = res.locals.reservation;
    if(table.capacity < reservation.people) {
     return next ({
      status: 400,
      message: "Table capacity can't be smaller than amount of people in reservation"
     });
    }
    return next();
  }

  async function tableIsOccupied(req, res, next) {
    const {reservation_id} = res.locals.table
    if(reservation_id){
        return next({
            status:400,
            message: `Table is currently occupied`
          });
    }
    return next()
  }


  async function update(req, res, next) {
    const {reservation_id} = req.body.data;
    const table_id = res.locals.table.table_id
  res.status(200).json({ data: await service.update(reservation_id, table_id)});
}

async function tableIsNotOccupied(req, res, next) {
  const {reservation_id} = res.locals.table
  if(reservation_id === null){
    return next({
        status:400,
        message: `Table is not occupied`
      });
  }
  return next();
}

async function destroy(req, res, next) {
  const { table_id, reservation_id } = res.locals.table;
  await service.destroy( reservation_id, table_id,);
  res.status(200).json({});
}

module.exports = {
    list: [asyncErrorBoundary(list)],

    create: [
      bodyDataHas("table_name"),
      bodyDataHas("capacity"),
      propertyIsNotEmpty("table_name"),
      capacityIsValidNumber,
      tableNameLength,
      asyncErrorBoundary(create),
    ],

    update: [
      bodyDataHas("reservation_id"),
      tableIdExists,
      reservationIdExists,
      validCapacity,
      tableIsOccupied,
      asyncErrorBoundary(update),
    ],

    delete: [
      tableIdExists,
      tableIsNotOccupied,
      asyncErrorBoundary(destroy),
    ],
}
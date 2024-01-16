const service = require ("./tables.service");
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
    const {reservationId} = req.body.data;
    const { tableId } = req.params;
    const table = await service.read(reservationId, tableId);
    if(table) {
        res.locals.table = table;
        return next();
    }
    return next({
        status: 404,
        message: "Reservation ID cannot be found",
    });
  }


  async function update(req, res, next) {
    const { reservationId } = req.body.data;
    const { tableId } = res.locals.table;

  try {
    if (!reservationId) {
      return next({
        status: 400,
        message: "Reservation ID is required for the update.",
      });
    }

    const updatedTable = await service.update(reservationId, tableId);

    if (!updatedTable || !updatedTable.length) {
      return next({
        status: 404,
        message: "Table not found or not updated.",
      });
    }

    res.json({ data: updatedTable });
  } catch (error) {
    console.error(error);
    next({
      status: 500,
      message: "Internal Server Error",
    });
  }
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
      reservationIdExists,
      asyncErrorBoundary(update),
    ]
}
const service = require ("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

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


module.exports = {
    create: [
      bodyDataHas("table_name"),
      bodyDataHas("capacity"),
      propertyIsNotEmpty("table_name"),
      capacityIsValidNumber,
      tableNameLength,
      asyncErrorBoundary(create),
    ],
}
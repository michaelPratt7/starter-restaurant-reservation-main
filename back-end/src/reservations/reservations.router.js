/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:reservation_id")
    .get(controller.read)
    .put(controller.resUpdate)
    .all(methodNotAllowed);
router.route("/:mobile_number")
    .get(controller.list)
    .all(methodNotAllowed);
router.route("/:reservation_id/status")
    .put(controller.statusUpdate)
    .all(methodNotAllowed);

router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);


module.exports = router;

const express = require("express");
const geoController = require("./../controllers/geoController");
const authController = require("./../controllers/authController");

const router = express.Router();

//router.use(authController.protect);
//router.use(authController.restrictTo("admin"));

router.route("/").post(geoController.createGeo);
router.route("/update/:id").patch(geoController.updateGeo);
router.route("/all").get(geoController.getAllGeo);
router.route("/:id").delete(geoController.deleteGeo);

module.exports = router;

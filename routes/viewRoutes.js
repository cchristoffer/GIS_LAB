const express = require("express");
const viewController = require("./../controllers/viewController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.get("/home", viewController.getHome);

router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.get("/admin", viewController.getAdmin);

module.exports = router;

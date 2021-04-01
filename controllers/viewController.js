const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");

exports.getHome = catchAsync(async (req, res) => {
  res.status(200).render("index.ejs", {});
});

exports.getAdmin = catchAsync(async (req, res) => {
  res.status(200).render("admin.ejs", {});
});

const catchAsync = require("./../utils/catchAsync");
const Geo = require("../models/geoModel");

exports.getHome = catchAsync(async (req, res) => {
  res.status(200).render("index.ejs", {});
});

exports.getAdmin = catchAsync(async (req, res) => {
  const geoData = await Geo.find();
  res.status(200).render("admin.ejs", { geoData: geoData });
});

const mongoose = require("mongoose");

const geoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please name the store"],
    },
    openHours: {
      type: String,
      required: [true, "Please provide the opening hours"],
    },
    photo: {
      type: String,
      required: [true, "Please provide a photo"],
    },
    storeUrl: {
      type: String,
      required: [true, "Please provide a url for the store"],
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

geoSchema.virtual("weatherData").get(function () {
  return (
    "http://api.openweathermap.org/data/2.5/weather?lat=" +
    this.location.coordinates[0] +
    "&lon=" +
    this.location.coordinates[1] +
    "&units=metric&appid=582e149fb362e1b98b83ade7442b13a2"
  );
});

const Geo = mongoose.model("Geo", geoSchema);

module.exports = Geo;

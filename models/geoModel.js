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
    weatherInfo: {},
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Factory = require("./../controllers/handlerFactory");
const Geo = require("./../models/geoModel");

exports.createGeo = Factory.createOne(Geo);
exports.getAllGeo = Factory.getAll(Geo);
exports.deleteGeo = Factory.deleteOne(Geo);
exports.updateGeo = Factory.updateOne(Geo);

const Doctor = require('./../models/doctorModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
  };

  exports.getAllTours = factory.getAll(Tour);
  exports.getTour = factory.getOne(Tour, { path: 'reviews' });
  exports.createTour = factory.createOne(Tour);
  exports.updateTour = factory.updateOne(Tour);
  exports.deleteTour = factory.deleteOne(Tour);


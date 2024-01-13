const Zone = require('./zone');

const AppError = require('../utils/appError.util');
const catchAsync = require('../utils/catchAsync.util');

exports.create = catchAsync(async (req, res, next) => {
  const zone = await Zone.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      zone,
    },
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const zones = await Zone.find();

  res.status(200).json({
    status: 'success',
    results: zones.length,
    data: {
      zones,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const zone = await Zone.findById(id);

  if (!zone) return next(new AppError('No zone found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      zone,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const zone = await Zone.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!zone) return next(new AppError('No zone found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      zone,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const zone = await Zone.findByIdAndDelete(id);

  if (!zone) return next(new AppError('No zone found with that ID', 404));

  res.status(204).json({});
});

exports.getZonesByRegion = catchAsync(async (req, res, next) => {
  const { regionId } = req.params;

  const zones = await Zone.find({ region: regionId });

  res.status(200).json({
    status: 'success',
    data: {
      zones,
    },
  });
});

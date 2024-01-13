const Region = require('./region');

const AppError = require('../utils/appError.util');
const catchAsync = require('../utils/catchAsync.util');

exports.create = catchAsync(async (req, res, next) => {
  const region = await Region.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      region,
    },
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const regions = await Region.find();

  res.status(200).json({
    status: 'success',
    results: regions.length,
    data: {
      regions,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const region = await Region.findById(id);

  if (!region) return next(new AppError('No region found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      region,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const region = await Region.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!region) return next(new AppError('No region found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      region,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const region = await Region.findByIdAndDelete(id);

  if (!region) return next(new AppError('No region found with that ID', 404));

  res.status(204).json({});
});

const Badge = require('./badge');

const AppError = require('../utils/appError.util');
const catchAsync = require('../utils/catchAsync.util');

exports.create = catchAsync(async (req, res, next) => {
  const badge = await Badge.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      badge,
    },
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const badges = await Badge.find();

  res.status(200).json({
    status: 'success',
    results: badges.length,
    data: {
      badges,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const badge = await Badge.findById(id);

  if (!badge) return next(new AppError('No badge found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      badge,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const badge = await Badge.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!badge) return next(new AppError('No badge found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      badge,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const badge = await Badge.findByIdAndDelete(id);

  if (!badge) return next(new AppError('No badge found with that ID', 404));

  res.status(204).json({});
});

const User = require('./user');

const AppError = require('../utils/appError.util');
const catchAsync = require('../utils/catchAsync.util');

exports.create = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const users = await User.find().select('+active');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) return next(new AppError('No user found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) return next(new AppError('No user found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) return next(new AppError('No user found with that ID', 404));

  res.status(204).json({});
});

exports.getByUsername = catchAsync(async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ username }).populate('badges');

  if (!user) return next(new AppError('No user found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.leaderboard = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: 'user' }).sort({ experience: -1 });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

const Character = require('./character');

const AppError = require('../utils/appError.util');
const catchAsync = require('../utils/catchAsync.util');

exports.create = catchAsync(async (req, res, next) => {
  const character = await Character.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      character,
    },
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const characters = await Character.find();

  res.status(200).json({
    status: 'success',
    results: characters.length,
    data: {
      characters,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const character = await Character.findById(id);

  if (!character)
    return next(new AppError('No character found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      character,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const character = await Character.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!character)
    return next(new AppError('No character found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      character,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const character = await Character.findByIdAndDelete(id);

  if (!character)
    return next(new AppError('No character found with that ID', 404));

  res.status(204).json({});
});

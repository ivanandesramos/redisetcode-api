const Quest = require('./quest');
const Result = require('../result/result');
const User = require('../users/user');

const AppError = require('../utils/appError.util');
const catchAsync = require('../utils/catchAsync.util');

exports.create = catchAsync(async (req, res, next) => {
  const quest = await Quest.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      quest,
    },
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const quests = await Quest.find().select('-questions');

  res.status(200).json({
    status: 'success',
    results: quests.length,
    data: {
      quests,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const quest = await Quest.findById(id);

  if (!quest) return next(new AppError('No quest found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      quest,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const quest = await Quest.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!quest) return next(new AppError('No quest found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      quest,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const quest = await Quest.findByIdAndDelete(id);

  if (!quest) return next(new AppError('No quest found with that ID', 404));

  res.status(204).json({});
});

exports.getQuests = catchAsync(async (req, res, next) => {
  // Get the user ID of the currently logged-in user (you'll need to implement this)
  const userId = req.user._id;

  // Find all quests
  const quests = await Quest.find();

  // Find all results for the current user
  const userResults = await Result.find({ user: userId });

  // Create a map to keep track of which quests have been taken by the user
  const userTakenQuests = new Map();
  userResults.forEach((result) => {
    userTakenQuests.set(result.quest.toString(), true);
  });

  // Create a list of quests with availability status
  const questsWithStatus = quests.map((quest) => {
    const isTaken = userTakenQuests.get(quest._id.toString()) || false;
    return {
      quest,
      isAvailable: !isTaken,
    };
  });

  res.status(200).json({
    status: 'success',
    results: questsWithStatus.length,
    data: {
      quests: questsWithStatus,
    },
  });
});

exports.submitAnswer = catchAsync(async (req, res, next) => {
  const userId = req.user._id; // Extracted from the authenticated user
  const { questId } = req.params;
  const { userResponses, bonus } = req.body;

  const user = await User.findById(userId);

  // Find the quest by ID
  const quest = await Quest.findById(questId);

  if (!quest) {
    return res.status(404).json({ message: 'Quest not found' });
  }

  let totalScore = 0;

  // Iterate through userResponses and compare with quest's questions
  userResponses.forEach((userResponse) => {
    const matchingQuestion = quest.questions.find(
      (question) => question.questionText === userResponse.questionText,
    );

    if (matchingQuestion && matchingQuestion.answer === userResponse.answer) {
      totalScore += 1; // Increase score for correct answer
    }
  });

  const isPassed = totalScore >= quest.passingScore;

  if (isPassed) {
    user.experience += bonus ? quest.exp * 2 : quest.exp;
  } else {
    user.experience += bonus
      ? Math.floor(quest.exp / 2) * 2
      : Math.floor(quest.exp / 2);
  }
  await user.save();

  const result = await Result.create({
    user: userId,
    quest: quest._id,
    userResponses,
    score: totalScore,
    isPassed,
  });

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.viewResult = catchAsync(async (req, res, next) => {
  const { questId } = req.params;
  const userId = req.user._id;

  // Find the result that matches the questId and userId
  const result = await Result.findOne({
    quest: questId,
    user: userId,
  }).populate('quest');

  if (!result) {
    return res.status(404).json({ message: 'Result not found' });
  }

  // Extract relevant information
  const quizName = result.quest.name;
  const { score } = result;

  // Map user responses to include choices, user answers, correct answers, and correctness
  const userResponses = result.quest.questions.map((question) => {
    const userResponse = result.userResponses.find(
      (response) => response.questionText === question.questionText,
    );

    return {
      questionText: question.questionText,
      choices: question.options,
      userAnswer: userResponse ? userResponse.answer : '',
      correctAnswer: question.answer, // Include correct answer
      isCorrect: userResponse ? userResponse.answer === question.answer : false,
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      result: {
        quizName,
        score,
        userResponses,
      },
    },
  });
});

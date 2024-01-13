const { Schema, model } = require('mongoose');

const questSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [String],
  questions: [
    {
      questionText: String,
      options: [String],
      answer: String,
    },
  ],
  time: {
    type: Number,
    required: true,
  },
  passingScore: {
    type: Number,
    required: true,
  },
  exp: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ['basic', 'pro'],
    default: 'basic',
  },
});

module.exports = model('Quest', questSchema);

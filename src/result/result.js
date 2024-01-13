const { Schema, model, SchemaTypes } = require('mongoose');

const resultSchema = new Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
    quest: {
      type: SchemaTypes.ObjectId,
      ref: 'Quest',
    },
    userResponses: [
      {
        questionText: String,
        answer: String,
      },
    ],
    score: {
      type: Number,
    },
    isPassed: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

module.exports = model('Result', resultSchema);

const { Schema, model } = require('mongoose');

const regionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    earnableBadges: [],
    type: {
      type: String,
      enum: ['basic', 'pro'],
      required: true,
      default: 'basic',
    },
  },
  { timestamps: true },
);

module.exports = model('Region', regionSchema);

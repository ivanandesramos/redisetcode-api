const { Schema, SchemaTypes, model } = require('mongoose');

const stageSchema = new Schema(
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
    content: {
      type: String,
      required: true,
    },
    codeSnippet: {
      type: String,
    },
    exp: {
      type: Number,
      default: 0,
    },
    stageNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    zone: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: 'Zone',
    },
    type: {
      type: String,
      enum: ['basic', 'pro'],
      default: 'basic',
    },
  },
  { timestamps: true },
);

module.exports = model('Stage', stageSchema);

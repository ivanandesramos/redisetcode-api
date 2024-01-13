const { Schema, SchemaTypes, model } = require('mongoose');

const zoneSchema = new Schema(
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
    region: {
      type: SchemaTypes.ObjectId,
      ref: 'Region',
    },
    type: {
      type: String,
      enum: ['basic', 'pro'],
      default: 'basic',
    },
  },
  { timestamps: true },
);

module.exports = model('Zone', zoneSchema);

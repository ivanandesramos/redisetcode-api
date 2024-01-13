const { Schema, model } = require('mongoose');

const characterSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Character name is required.'],
      unique: true,
    },
    avatar: {
      type: String,
      required: [true, 'Character avatar is required.'],
    },
    description: {
      type: String,
      required: [true, 'Character description is required.'],
    },
  },
  { timestamps: true },
);

module.exports = model('Character', characterSchema);

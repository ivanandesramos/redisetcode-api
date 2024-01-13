const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    unique: true,
  },
});

module.exports = model('Event', eventSchema);

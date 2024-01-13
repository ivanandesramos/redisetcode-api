/* eslint-disable no-restricted-syntax */
const Event = require('./event');

// const AppError = require('../utils/appError.util');
const catchAsync = require('../utils/catchAsync.util');

// Weighted Random Selection Algorithm that select random event based on the events provided.
function selectRandomEvent(events) {
  const r = Math.random();
  let t = 0;

  for (const { event, weight } of events) {
    t += weight;
    if (t > r) {
      return event;
    }
  }

  return null;
}

const events = [
  {
    event: 'Normal',
    weight: 0.8,
  },
  {
    event: 'Hidden',
    weight: 0.05,
  },
  {
    event: 'Bonus',
    weight: 0.15,
  },
];

exports.getEvent = catchAsync(async (req, res, next) => {
  // Check if there's already an event for the current day
  const currentDate = new Date().toLocaleDateString('en-US', {
    timeZone: 'Asia/Manila',
  });
  const existingEvent = await Event.findOne({ date: currentDate });

  if (existingEvent) {
    res.status(200).json({
      status: 'success',
      data: {
        event: existingEvent,
        msg: 'There is an existing event.',
      },
    });
  } else {
    // If no event is assigned, use the random selection algorithm to pick one
    const selectedEventName = selectRandomEvent(events);

    // Create and save the new event with the current date
    const selectedEvent = new Event({
      name: selectedEventName,
      date: currentDate,
    });
    await selectedEvent.save();

    res.status(200).json({
      status: 'success',
      data: {
        event: selectedEvent,
      },
    });
  }
});

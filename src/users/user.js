const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const { Schema, model, SchemaTypes } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      minlength: 3,
      lowercase: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    character: {
      name: String,
      avatar: String,
    },
    completedStages: [
      {
        type: SchemaTypes.ObjectId,
        ref: 'Stage',
      },
    ],
    badges: [
      {
        type: SchemaTypes.ObjectId,
        ref: 'Badge',
      },
    ],
    level: {
      type: Number,
      default: 1,
    },
    experience: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    type: {
      type: String,
      enum: ['basic', 'pro'],
      default: 'basic',
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  },
);

// Encrypt password
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Leveling system
userSchema.pre('save', function (next) {
  const { experience } = this;

  if (experience >= 0 && experience <= 50) {
    this.level = 1;
  } else if (experience >= 51 && experience <= 150) {
    this.level = 2;
  } else if (experience >= 151 && experience <= 250) {
    this.level = 3;
  } else if (experience >= 251 && experience <= 350) {
    this.level = 4;
  } else if (experience >= 351) {
    this.level = 5;
  }

  // I will add more levels later

  next();
});

// Check if the password is correct when logging in
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = model('User', userSchema);

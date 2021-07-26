const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;
const SALT_FACTOR = 6;

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },
    login: {
      type: String,
      required: [true, 'Login is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    notAllowedProducts: {
      type: [String],
    },
    dailyCalories: {
      type: Number,
    },
    userInfo: {
      type: Object,
      age: {
        type: Number,
      },
      height: {
        type: Number,
      },
      currentWeight: {
        type: Number,
      },
      desireWeight: {
        type: Number,
      },
      groupBlood: {
        type: Number,
        enum: [1, 2, 3, 4],
      },
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false },
);

usersSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      bcrypt.genSaltSync(SALT_FACTOR),
    );
  }
  return next();
});

usersSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('user', usersSchema);

module.exports = { User };

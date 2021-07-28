const mongoose = require('mongoose');
const { Schema } = mongoose;

const userProductsSchema = new Schema(
  {
    date: {
      type: String,
    },
    products: {
      type: [
        {
          title: {
            type: String,
          },
          weight: {
            type: Number,
            default: 100,
          },
          calories: { type: Number },
        },
      ],
    },
    totalCalories: {
      type: Number,
    },
    leftCalories: {
      type: Number,
    },
    dailyNormalProcent: {
      type: Number,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false },
);

const UserProduct = mongoose.model('userProduct', userProductsSchema);

module.exports = { UserProduct };

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userProductsSchema = new Schema(
  {
    totalCalories: {
      type: Number,
    },
    date: {
      type: Date,
    },
    products: {
      type: [
        {
          weight: {
            type: Number,
            default: 100,
          },
          title: {
            type: String,
          },
        },
      ],
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false },
);

const UserProduct = mongoose.model('userProduct', userProductsSchema);

module.exports = { UserProduct };

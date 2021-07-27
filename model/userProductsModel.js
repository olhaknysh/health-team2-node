const mongoose = require('mongoose');
const { Schema } = mongoose;

const userProductsSchema = new Schema(
  {
    totalCalories: {
      type: Number,
    },
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
        },
      ],
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

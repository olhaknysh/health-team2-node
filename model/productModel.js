const mongoose = require('mongoose');
const { Schema } = mongoose;

const productsSchema = new Schema(
  {
    categories: {
      type: [String],
    },
    weight: {
      type: Number,
      default: 100,
    },
    title: {
      type: Object,
      ru: {
        type: String,
      },
      ua: {
        type: String,
      },
    },

    calories: {
      type: Number,
    },
    groupBloodNotAllowed: {
      type: Object,
      1: { type: Boolean },
      2: { type: Boolean },
      3: { type: Boolean },
      4: { type: Boolean },
    },
  },
  { versionKey: false },
);

const Product = mongoose.model('product', productsSchema);

module.exports = { Product };

const { getAllProducts } = require('../services/productsService');
const calcDailyCalories = (age, height, currentWeight, desireWeight) => {
  const dailyCalories =
    10 * currentWeight +
    6.25 * height -
    5 * age -
    161 -
    10 * (currentWeight - desireWeight);
  const result = Math.round(dailyCalories);
  return result;
};

const getNotAllowedCategoriesProducts = async groupBloode => {
  const products = await getAllProducts();
  const notAllovedCategoriesProducts = await products
    .reduce((allproducts, product) => {
      if (product.groupBloodNotAllowed[groupBloode]) {
        allproducts.push(...product.categories);
      }
      return allproducts;
    }, [])
    .filter(
      (category, idx, categories) => categories.indexOf(category) === idx,
    );

  return notAllovedCategoriesProducts;
};

module.exports = {
  calcDailyCalories,
  getNotAllowedCategoriesProducts,
};

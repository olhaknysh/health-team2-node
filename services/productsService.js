const { Product } = require('../model/productModel');
const { CustomError } = require('../helpers/errors');
const { statusCode } = require('../helpers/constants');

const getAllProducts = async () => {
  const products = await Product.find();
  return products;
};

const getProductByTitle = async title => {
  const product = await Product.findOne({ 'title.ru': title });
  return product;
};

const getProductsByQuery = async query => {
  const { search, limit = 5, page = 1 } = query;
  const words = search.split(' ');
  const normilizedWords = words.reduce((allWords, word) => {
    if (word.trim()) {
      allWords.push(word);
    }
    return allWords;
  }, []);
  const normalizedSearch = normilizedWords.join(' ');
  const searchOptions = {
    'title.ru': { $regex: `^${normalizedSearch}`, $options: 'i' },
  };
  const { docs: products, totalDocs: total } = await Product.paginate(
    searchOptions,
    {
      limit,
      page,
      select: '_id title categories calories weight',
    },
  );

  if (products.length === 0 && page) {
    throw new CustomError(
      statusCode.BAD_REQUEST,
      'No allowed products found for this query',
    );
  }

  return { products, total, limit, page: Number(page) };
};

module.exports = {
  getAllProducts,
  getProductsByQuery,
  getProductByTitle,
};

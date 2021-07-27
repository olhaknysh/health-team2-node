const { Product } = require('../model/productModel');
const { CustomError } = require('../helpers/errors');
const { statusCode } = require('../helpers/constants');

const getAllProducts = async () => {
  const products = await Product.find();
  return products;
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
  const { docs: findedProducts, totalDocs: total } = await Product.paginate(
    searchOptions,
    {
      limit,
      page,
    },
  );

  const normalizesProducts = findedProducts.map(
    ({ title, categories, calories }) => ({ title, categories, calories }),
  );
  if (normalizesProducts.length === 0 && page) {
    throw new CustomError(
      statusCode.UNPROCESSABLE_ENTITY,
      'No allowed products found for this query',
    );
  }

  return { normalizesProducts, total, limit, page: Number(page) };
};

module.exports = {
  getAllProducts,
  getProductsByQuery,
};

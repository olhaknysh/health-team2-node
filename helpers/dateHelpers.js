const moment = require('moment');

const getInitialDate = (date = new Date()) => {
  const startDate = moment(date).format('L').split('/');
  const day = startDate[1];
  const month = startDate[0];
  const year = startDate[2];
  const initialDate = `${day}-${month}-${year}`;
  return initialDate;
};

module.exports = { getInitialDate };

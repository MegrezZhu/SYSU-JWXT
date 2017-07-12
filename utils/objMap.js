const _ = require('lodash');

module.exports = mapper => {
  return origin => {
    const res = {};
    for (let [key, value] of Object.entries(mapper)) {
      res[value] = _.get(origin, key);
    }
    return res;
  };
};

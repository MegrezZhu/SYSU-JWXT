module.exports = str => {
  // return JSON.parse(str.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": '));
  return eval(`(${str})`); // now use evil eval
};

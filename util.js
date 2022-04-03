const fs = require('fs');
const colorize = require('./colorize');

/* Callbacks */

module.exports.uniques = (array) => {
  return [...new Set(array)];
};

module.exports.additor = (a, b) => {
  return a + b;
};

module.exports.emptyness = (obj) => {
  return obj && Object.keys(obj).length !== 0;
};

module.exports.sortBy = (property, isNumeric) => {
  return (a, b) => {
    if (isNumeric) return Number(a[property]) > Number(b[property]) ? 1 : -1;
    return a[property] > b[property] ? 1 : -1;
  };
};

/* Print Masks */
module.exports.cardMask = (card) => {
  return `  ${card.id}\t (x${card.amount}) ${card.name} $${card.price}`;
};

module.exports.setMask = (set) => {
  return `  ${set.id}\t${set.owned}/${set.num_cards}\t ${set.name}`;
};

module.exports.objectMask = (obj) => {
  let result = [];
  for (key in obj) {
    value = obj[key];
    separator = key.length >= 7 ? '\t' : '\t\t';
    if (value) result.push(`${key}:${separator}${value}`);
  }
  return result.join('\n');
};

module.exports.errorMask = (message) => {
  return (
    colorize('Error:', {
      color: 'red',
      bold: true,
    }),
    message
  );
};

/* Validators */

module.exports.checkId = (id) => {
  //todo: if id dont match, throw an exception
};

module.exports.checkArgs = (args, n) => {
  if (args.length !== n + 1) throw new Error('Wrong number of parameters');
};

/* Other functions */

module.exports.getLang = (id) => {
  this.checkId();
  parts = id.split('-');
  if (parts.length === 1 || parts[1].length <= 3) return 'EN';
  else return parts[1].substr(0, 2);
};


module.exports.getSetId = (id) => {
  this.checkId();
  return id.split('-')[0];
};

module.exports.parseId = (id) => {
  this.checkId();
  parts = id.toUpperCase().split('-');
  if (parts.length === 1) return id;
  if (parts[1].length <= 3) return id;
  parts[1] = '-EN' + parts[1].substring(2);
  return parts.join('');
};

module.exports.lowestPrice = (prices) => {
  return Math.min(...Object.values(prices));
};

module.exports.getProps = (object) => {
  //todo: add validation
  let props = [
    'name',
    'type',
    'desc',
    'atk',
    'def',
    'level',
    'race',
    'attribute',
  ];
  const result = {};
  props.forEach((property) => {
    result[property] = object[property];
  });
  return result;
};

module.exports.readImportFile = (filename) => {
  if (!fs.existsSync(filename)) throw new Error('Wrong filename!');
  return fs
    .readFileSync(filename)
    .toString()
    .split('\n')
    .map((line) => line.replace(/[^ -~]+/g, ''))
    .filter((line) => line != '');
};

module.exports.defaultCard = (id) => {
  return {
    id,
    name: '-',
    type: undefined,
    desc: undefined,
    atk: undefined,
    def: undefined,
    level: undefined,
    race: undefined,
    attribute: undefined,
    amount: 1,
    rarity: undefined,
    set_name: undefined,
    set_code: this.getSetId(id),
    lang: this.getLang(id),
    price: 0,
    price_low: 0,
    image: '0',
  };
};

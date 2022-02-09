const fs = require('fs');

module.exports.uniques = (array) => {
  return [...new Set(array)];
};

module.exports.additor = (a, b) => {
  return a + b;
};

module.exports.emptyness = (obj) => {
  return (obj && Object.keys(obj).length !== 0);
};

module.exports.cardMask = (card) => {
  return `  ${card.id}\t (x${card.amount}) ${card.name} $${card.price}`;
};

module.exports.setMask = (set) => {
  return `  ${set.id}\t${set.owned}/${set.num_cards}\t ${set.name}`;
};

module.exports.checkId = (id) => {
  //todo: if id dont match, throw an exception
};

module.exports.getLang = (id) => {
  this.checkId();
  parts = id.split('-');
  if (parts.length === 1 || parts[1].length <= 3) return 'EN';
  else return parts[1].substr(0, 2);
};

module.exports.parseId = (id) => {
  this.checkId();
  parts = id.split('-');
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
    set_code: id.split('-')[0],
    lang: this.getLang(id),
    price: 0,
    price_low: 0,
    image: '0',
  };
};

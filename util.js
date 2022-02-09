module.exports.additor = (a, b) => {
  return a + b;
};

module.exports.cardMask = (card) => {
  return `  ${card.id}\t (x${card.amount}) ${card.name || '-'} $${card.price}`;
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

module.exports.getProps = (object, props) => {
  //todo: add validation
  const result = {};
  props.forEach((property) => {
    result[property] = object[property];
  });
  return result;
};

module.exports.readInputFile = (filename) => {
  //todo: add validation
  return fs
    .readFileSync(filename)
    .toString()
    .split('\n')
    .map((line) => line.replace(/[^ -~]+/g, ''))
    .filter((line) => line != '');
};

module.exports.defaultCard = (id) => {
  return {
    id: util.parseId(id),
    name: undefined,
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
    set_id: undefined,
    lang: util.getLang(id),
    price: 0,
    price_low: 0,
    image: undefined,
  };
};

const fs = require('fs');
const util = require('./util');

module.exports.readFile = (filename) => {
  if (!fs.existsSync(filename)) throw new Error('Wrong filename!');
  let current = '';
  const deck = { main: [], extra: [], side: [] };
  fs.readFileSync(filename)
    .toString()
    .split('\n')
    .map((line) => line.replace(/[^ -~]+/g, ''))
    .forEach((line) => {
      switch (line.substring(0, 5)) {
        case '#main':
          current = 'main';
          break;
        case '#extr':
          current = 'extra';
          break;
        case '!side':
          current = 'side';
          break;
        default:
          if (parseInt(line)) {
            deck[current].push(line);
          }
          break;
      }
    });
  return deck;
};

module.exports.completitude = (deck, db) => {
  //TODO: check the amount of cards
  let result = {};
  Object.keys(deck).forEach((key) => {
    if (deck[key].length > 0){
      result[key] =
        (
          (100 *
            deck[key]
              .map((number) => db.getCardsIdsBy('number', number).length > 0)
              .reduce(util.additor)) /
          deck[key].length
        ).toFixed(2) + '%';
    } else {
      result[key] = '100%'
    }
  });
  return result;
};

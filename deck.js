const fs = require('fs');
const util = require('./util');

function checkPercent(deck, db) {
  //TODO: check the amount of cards
  let result = {};
  Object.keys(deck).forEach((key) => {
    if (deck[key].length > 0) {
      result[key] =
        (100 *
          deck[key]
            .map((number) => db.getCardsIdsBy('number', number).length > 0)
            .reduce(util.additor)) /
        deck[key].length;
    } else {
      result[key] = -1;
    }
  });
  return result;
}

function check(deck, db) {
  //TODO: check the amount of cards
  let result = {missing :0};
  Object.keys(deck).forEach((key) => {
    if (deck[key].length > 0) {
      amount = deck[key]
            .map((number) => db.getCardsIdsBy('number', number).length > 0)
            .reduce(util.additor)
      result[key] = 0+amount+'/'+deck[key].length;
      result['missing'] += deck[key].length - amount 
    } else {
      result[key] = '0/0';
    }
  });
  return result;
}

function load(filename) {
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
}

module.exports.readFolder = (folder, db) => {
  return fs
    .readdirSync(folder)
    .map((name) => {
      deck = load(`${folder}/${name}`);
      completitude = checkPercent(deck, db);
      score = (completitude.main + completitude.extra) / 2;
      return { name, deck, completitude, score };
    })
    .sort(util.sortBy('score', true));
};

module.exports.readFile = (filename, db) => {
  name = filename.split('\\').slice(-1)[0].split('/').slice(-1)[0];
  deck = load(filename);
  completitude = checkPercent(deck, db);
  completitude2 = check(deck, db);
  score = ((completitude.main + completitude.extra) / 2) + '%';
  return {
    name,
    main: completitude2.main,
    extra: completitude2.extra,
    side: completitude2.side,
    missing: completitude2.missing || '0',
    score,
    //cards: 'a\n\t\tb\n\t\tc'
  };
};

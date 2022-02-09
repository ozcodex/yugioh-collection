const util = require('./util');
const fs = require('fs');
const all_cards = require('./all_cards.json').data;
const all_sets = require('./all_sets.json');
const db = require('./db.json');

function cardInfo(id) {
  let p_id = util.parseId(id);
  const card = all_cards.filter((card) =>
    card.card_sets?.some((set) => set.set_code === p_id)
  )[0];
  if (!card) return null;
  const set = card.card_sets.filter((set) => set.set_code === p_id)[0];
  return {
    id: id,
    name: card.name,
    type: card.type,
    desc: card.desc,
    atk: card.atk,
    def: card.def,
    level: card.level,
    race: card.race,
    attribute: card.attribute,
    rarity: set?.set_rarity,
    set_name: set?.set_name,
    set_id: id.split('-')[0],
    price: set?.set_price,
    price_low: util.lowestPrice(card.card_prices[0]),
    image: card.card_images[0].id,
  };
}

function readInputFile(filename) {
  return fs
    .readFileSync(filename)
    .toString()
    .split('\n')
    .map((line) => line.replace(/[^ -~]+/g, ''))
    .filter((line) => line != '');
}

function saveDB() {
  fs.writeFileSync('db.json', JSON.stringify(db));
}

function addCard(id) {
  if (db[id]) {
    db[id].amount++;
    return db[id];
  }
  card = cardInfo(id);
  if (card) {
    db[id] = {
      ...card,
      amount: 1,
      lang: util.getLang(id),
    };
    return db[id];
  }
  db[id] = {
    id: util.parseId(id),
    amount: 1,
    missing: true,
    lang: util.getLang(id),
    price: 0,
    price_low: 0,
  };
  return db[id];
}

function searchCard(property, value, strict = false) {
  result = [];
  for (id in db) {
    let card = db[id];
    if (card[property]) {
      if (strict) {
        if (card[property] == value) result.push(card);
      } else {
        let regex = /[\W_ ]/g;
        if (
          card[property]
            .toString()
            .toLowerCase()
            .replace(regex, '')
            .includes(value.toString().toLowerCase().replace(regex, ''))
        )
          result.push(card);
      }
    }
  }
  return result;
}

function exportCards(filename) {
  fs.writeFileSync(
    'cards.txt',
    Object.values(db)
      .map((card) => (card.id + '\n').repeat(card.amount))
      .join('')
      .replace(/^\s+|\s+$/g, '')
  );
}

function totalValue() {
  return Object.values(db)
    .map((card) => (card.price || 0) * card.amount)
    .reduce(util.additor)
    .toFixed(2);
}

function totalLowValue() {
  return Object.values(db)
    .map((card) => (card.price_low || 0) * card.amount)
    .reduce(util.additor)
    .toFixed(2);
}

function countCards() {
  return Object.values(db)
    .map((card) => card.amount)
    .reduce(util.additor);
}

function countCardsBy(prop) {
  return [...new Set(Object.values(db).map((card) => card[prop]))].length;
}

function collectionStatus() {
  return ((100 * countCardsBy('name')) / all_cards.length).toFixed(2);
}

function loadFile(name) {
  readInputFile(name).forEach((id) => addCard(id));
  saveDB();
}

//========================//

const args = process.argv.slice(2);

switch (args[0]) {
  case '-l':
    for (id in db) {
      console.info(
        `  ${id}\t (x${db[id].amount}) ${db[id].name || '-'} $${db[id].price}`
      );
    }
    break;
  case '-i':
    console.info(`Total average value: $${totalValue()}`);
    console.info(`Total low value: $${totalLowValue()}`);
    console.info(`Total amount of cards: ${countCards()}`);
    console.info(`Cards with unique id: ${Object.keys(db).length}`);
    console.info(`Cards with unique name: ${countCardsBy('name')}`);
    console.info(`Total sets in collection: ${countCardsBy('set_id')}`);
    console.info(`Total all cards: ${all_cards.length}`);
    console.info(`Total all sets: ${all_sets.length}`);
    console.info(`Collection status: ${collectionStatus()}%`);
    break;
  case '-c':
    card_id = args[1];
    if (card_id in db) {
      let card = db[card_id];
      for (key in card) {
        value = card[key];
        separator = key.length >= 7 ? '\t' : '\t\t';
        if (value) console.info(`${key}:${separator}${value}`);
      }
    } else {
      console.error(`${card_id} not found`);
    }
    break;
  case '-s':
    searchCard(args[1], args[2], args[3] == 'true').forEach((card) =>
      console.info(`  ${card.id}\t (x${card.amount}) ${card.name || ''}`)
    );
    break;
  case '-a':
    filename = args[1];
    if (fs.existsSync(filename)) loadFile(filename);
    else console.error('bad file');
    break;
  case '-e':
    exportCards();
    console.info('done!');
    break;
  case '-r':
    card_id = args[1];
    if (card_id in db) {
      if (--db[card_id].amount < 0) {
        delete db[card_id];
        console.info(`${card_id} deleted from db`);
      } else {
        console.info(`${card_id} amount reduced`);
      }
      fs.appendFileSync('deleted.txt', card_id);
      saveDB();
    } else {
      console.error(`${card_id} not found`);
    }
    break;
  case '-d':
    card_id = args[1];
    if (card_id in db) {
      delete db[card_id];
      fs.appendFileSync('deleted.txt', card_id);
      console.info(`${card_id} deleted from db`);
      saveDB();
    } else {
      console.error(`${card_id} not found`);
    }
    break;
  case '-D':
    for (id in db) delete db[id];
    saveDB();
    console.info('Done!');
    break;
  case '-h':
    console.info(`
Yugioh Collection Manager

  -l 
    list all cards in collection.

  -i
    shows relevant info about current collection
  
  -c id
    shows detailed information about card

  -s property value [strict]
    search the cards containing the value in the property,
    stricts is a optional boolean and indicates if strict
    search should be used.

  -a filename
    adds the ids indicated in the filename to database

  -e
    exports all the cards ids to cards.txt file

  -r id
    removes a card from collection decreasing its amount or
    deleting it if is the last one

  -d id
    deletes a card using it id

  -D
    Delete all registers in database

  -h
    shows this help
`);
    break;
  default:
    console.info(`Invalid option '${args[0]}', use -h to for more information`);
}

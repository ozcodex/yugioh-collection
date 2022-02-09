const util = require('./util');
const DB = require('./db');

const db = new DB('main.db');

const args = process.argv.slice(2);

switch (args[0]) {
  case '-l':
    db.cards.forEach((card) => console.info(util.cardMask(card)));
    break;
  case '-L':
    db.sets.forEach((set) => console.info(util.setMask(set)))
    break;
  case '-i':
    console.info(`Total average value: $${db.totalValue}`);
    console.info(`Total low value: $${db.totalLowValue}`);
    console.info(`Total amount of cards: ${db.totalCards}`);
    console.info(`Cards with unique id: ${db.cards.length}`);
    console.info(`Cards with unique name: ${db.cardNames.length}`);
    console.info(`Total sets in collection: ${db.totalSets}`);
    console.info(`Total all cards: ${db.allCardsLength}`);
    console.info(`Total all sets: ${db.allSetsLength}`);
    console.info(`Collection status: ${db.collectionStatus}%`);
    break;
  case '-c':
    if (!args[1]) return console.error('Wrong number of parameters');
    card = db.getCard(args[1]);
    if (card) {
      for (key in card) {
        value = card[key];
        separator = key.length >= 7 ? '\t' : '\t\t';
        if (value) console.info(`${key}:${separator}${value}`);
      }
    } else {
      console.error('Card not found');
    }
    break;
  case '-t':
    if (!args[1]) return console.error('Wrong number of parameters');
    set = db.getSetInfo(args[1]);
    if (set) {
      for (key in set) {
        value = set[key];
        separator = key.length >= 7 ? '\t' : '\t\t';
        if (value) console.info(`${key}:${separator}${value}`);
      }
    } else {
      console.error('Set not found');
    }
    break;
  case '-s':
    if (!args[1] || !args[2])
      return console.error('Wrong number of parameters');
    db.searchCard(args[1], args[2]).forEach((card) =>
      console.info(util.cardMask(card))
    );
    break;
  case '-a':
    if (!args[1]) return console.error('Wrong number of parameters');
    db.importCards(args[1]);
    console.info('done!');
    break;
  case '-e':
    if (!args[1]) return console.error('Wrong number of parameters');
    db.exportCards(args[1]);
    console.info('done');
    break;
  case '-r':
    if (!args[1]) return console.error('Wrong number of parameters');
    card = db.getCard(args[1]);
    if (card) {
      db.decreaseCardAmount(card.id);
      console.info('done');
    } else {
      console.error('Card not found');
    }
    break;
  case '-d':
    if (!args[1]) return console.error('Wrong number of parameters');
    card = db.getCard(args[1]);
    if (card) {
      db.deleteCard(card.id);
      console.info('done');
    } else {
      console.error('Card not found');
    }
    break;
  case '-D':
    db.deleteDB();
    console.info('Done!');
    break;
  case '-h':
    console.info(`
Yugioh Collection Manager

  -l 
    list all cards in collection

  -L
    list all owned sets

  -i
    shows relevant info about current collection
  
  -c id
    shows detailed information about a card

  -t id
    shows detailed information about a set

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
    console.info(
      `Invalid option '${args[0] || ''}', use -h to for more information`
    );
}

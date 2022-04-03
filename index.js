const util = require('./util');
const DB = require('./db');

const db = new DB('main.db');

const args = process.argv.slice(2);

try {
  switch (args[0]) {
    case '-l':
      util.checkArgs(args, 0);
      db.cards
        .sort(util.sortBy('price',true))
        .forEach((card) => console.info(util.cardMask(card)));
      break;
    case '-L':
      util.checkArgs(args, 0);
      db.sets
        .sort(util.sortBy('owned'))
        .forEach((set) => console.info(util.setMask(set)));
      break;
    case '-i':
      util.checkArgs(args, 0);
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
      util.checkArgs(args, 1);
      card = db.getCard(args[1]);
      if (card) {
        console.info(util.objectMask(card));
      } else {
        console.error('Card not found');
      }
      break;
    case '-t':
      util.checkArgs(args, 1);
      set = db.getSetInfo(args[1]);
      if (set) {
        console.info(util.objectMask(set));
      } else {
        console.error('Set not found');
      }
      break;
    case '-s':
      util.checkArgs(args, 2);
      db.searchCard(args[1], args[2]).forEach((card) =>
        console.info(util.cardMask(card))
      );
      break;
    case '-a':
      util.checkArgs(args, 1);
      db.addCard(args[1]);
      console.info('Done!');
      break;
    case '-A':
      util.checkArgs(args, 1);
      db.importCards(args[1]);
      console.info('Done!');
      break;
    case '-e':
      util.checkArgs(args, 1);
      db.exportCards(args[1]);
      console.info('Done!');
      break;
    case '-r':
      util.checkArgs(args, 1);
      card = db.getCard(args[1]);
      if (card) {
        db.decreaseCardAmount(card.id);
        console.info('Done!');
      } else {
        console.error('Card not found');
      }
      break;
    case '-d':
      util.checkArgs(args, 1);
      card = db.getCard(args[1]);
      if (card) {
        db.deleteCard(card.id);
        console.info('Done!');
      } else {
        console.error('Card not found');
      }
      break;
    case '-D':
      util.checkArgs(args, 0);
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

  -a id
    adds the given card to the database.

  -A filename
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
} catch (e) {
  console.error(util.errorMask(e.message));
}
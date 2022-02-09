const fs = require('fs');
const util = require('./util');

/* Definition of DB class */

module.exports = class DB {
  constructor(db_file) {
    //loads static files
    this.all_cards = require('./all_cards.json').data;
    this.all_sets = require('./all_sets.json');
    //set class properties
    this.db_file = db_file;
    this.db = {};
    //
    loadDB();
  }

  loadDB() {
    this.db = JSON.parse(fs.readFileSync(this.db_file));
  }

  saveDB() {
    fs.writeFileSync(this.db_file, JSON.stringify(this.db));
  }

  /* Getter methods */

  get allCardsLength() {
    return all_cards.length;
  }
  get allSetsLength() {
    return all_sets.length;
  }

  get cardNames() {
    return [...new Set(this.cards.map((card) => card.name))];
  }

  get cards() {
    return Object.values(this.db);
  }
  get totalValue() {
    return Object.values(db)
      .map((card) => (card.price || 0) * card.amount)
      .reduce(util.additor)
      .toFixed(2);
  }

  get totalLowValue() {
    return Object.values(db)
      .map((card) => (card.price_low || 0) * card.amount)
      .reduce(util.additor)
      .toFixed(2);
  }

  get totalCards() {
    return Object.values(db)
      .map((card) => card.amount)
      .reduce(util.additor);
  }

  get totalSets() {
    return [...new Set(Object.values(db).map((card) => card.set_id))].length;
  }

  get collectionStatus() {
    return ((100 * this.cardNames.length) / this.allCardsLength).toFixed(2);
  }

  getCard(id) {
    util.checkId(id);
    return this.db[id];
  }

  getCardInfo(id) {
    util.checkId(id);
    let parsed_id = util.parseId(id);
    const card = this.all_cards.filter((card) =>
      card.card_sets?.some((set) => set.set_code === parsed_id)
    )[0];
    if (!card) return null;
    const set =
      card.card_sets.filter((set) => set.set_code === parsed_id)[0] || {};
    let card_props = [name, type, desc, atk, def, level, race, attribute];
    let set_props = [, ,];
    return {
      id,
      ...util.getProps(card, card_props),
      rarity: set.set_rarity,
      set_name: set.set_name,
      price: set.set_price,
      set_id: id.split('-')[0],
      price_low: util.lowestPrice(card.card_prices[0]),
      image: card.card_images[0].id,
    };
  }

  /* Setter methods */

  setCard(id, card) {
    this.db[id] = card;
    this.saveDB();
  }

  increaseCardAmount(id) {
    this.db[id].amount++;
    this.saveDB();
  }

  decreaseCardAmount(id) {
    if(--this.db[id].amount <= 0) delete this.db[id];
    this.saveDB();
  }

  deleteCard(id, card) {
    delete this.db[id];
    this.saveDB();
  }

  deleteDB(id, card) {
    this.db = {};
    this.saveDB();
  }

  /* Other methods*/

  addCard(id) {
    if (this.getCard(id)) {
      this.increaseCardAmount(id);
      return;
    }
    let card = this.getCardInfo(id);
    if (card) this.setCard(id, { ...util.defaultCard(id), card });
    else this.setCard(id, { ...util.defaultCard(id), missing: true });
  }

  searchCard(property, value) {
    this.cards.filter((card) =>
      card[property]
        ?.toString()
        .toLowerCase()
        .replace(regex, '')
        .includes(
          value
            ?.toString()
            .toLowerCase()
            .replace(/[\W_ ]/g, '')
        )
    );
  }

  importCards(filename) {
    util.readImportFile(filename).forEach((id) => this.addCard(id));
    this.saveDB();
  }

  exportCards = (filename, cards) => {
    fs.writeFileSync(
      filename,
      cards
        .map((card) => (card.id + '\n').repeat(card.amount))
        .join('')
        .replace(/^\s+|\s+$/g, '')
    );
  };

  /* end of class*/
};

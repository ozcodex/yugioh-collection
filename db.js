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
    this.loadDB();
  }

  loadDB() {
    this.db = JSON.parse(fs.readFileSync(this.db_file));
  }

  saveDB() {
    fs.writeFileSync(this.db_file, JSON.stringify(this.db));
  }

  /* Getter methods */

  get allCardsLength() {
    return this.all_cards.length;
  }
  get allSetsLength() {
    return this.all_sets.length;
  }

  get cardNames() {
    return util.uniques(this.cards.map((card) => card.name));
  }

  get cards() {
    return Object.values(this.db.cards);
  }

  get cardIds() {
    return Object.keys(this.db.cards);
  }

  get setIds() {
    return util.uniques(this.cards.map((card) => card.set_code));
  }

  get sets() {
    return this.setIds
      .map((set_id) => this.getSetInfo(set_id))
      .filter(util.emptyness);
  }

  get totalValue() {
    return this.cards
      .map((card) => (card.price || 0) * card.amount)
      .reduce(util.additor)
      .toFixed(2);
  }

  get totalLowValue() {
    return this.cards
      .map((card) => (card.price_low || 0) * card.amount)
      .reduce(util.additor)
      .toFixed(2);
  }

  get totalCards() {
    return this.cards.map((card) => card.amount).reduce(util.additor);
  }

  get totalSets() {
    return [...new Set(this.cards.map((card) => card.set_id))].length;
  }

  get collectionStatus() {
    return ((100 * this.cardNames.length) / this.allCardsLength).toFixed(2);
  }

  getCard(id) {
    util.checkId(id);
    return this.db.cards[id];
  }

  getCardsIdsBy(property, value) {
    return util.uniques(
      this.cards
        .filter((card) => card[property] == value)
        .map((card) => card.id)
    );
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
    return {
      id,
      ...util.getProps(card),
      rarity: set.set_rarity,
      set_name: set.set_name,
      price: set.set_price,
      price_low: util.lowestPrice(card.card_prices[0]),
      image: card.card_images[0].id,
    };
  }

  getSetInfo(set_id) {
    let result = this.all_sets.find((set) => set.set_code == set_id);
    if (!result) return {};
    return {
      name: result.set_name,
      id: result.set_code,
      num_cards: result.num_of_cards,
      date: result.tcg_date,
      owned: util.uniques(
        this.getCardsIdsBy('set_code', set_id).map((id) => util.parseId(id))
      ).length,
    };
  }

  /* Setter methods */

  setCard(id, card) {
    this.db.cards[id] = card;
    this.saveDB();
  }

  increaseCardAmount(id) {
    this.db.cards[id].amount++;
    this.saveDB();
  }

  decreaseCardAmount(id) {
    if (--this.db.cards[id].amount <= 0) delete this.db.cards[id];
    this.saveDB();
  }

  deleteCard(id, card) {
    delete this.db.cards[id];
    this.saveDB();
  }

  deleteDB(id, card) {
    this.db = { cards: {} };
    this.saveDB();
  }

  /* Other methods*/

  addCard(id) {
    if (this.getCard(id)) {
      this.increaseCardAmount(id);
      return;
    }
    let card = this.getCardInfo(id);
    if (card) this.setCard(id, { ...util.defaultCard(id), ...card });
    else this.setCard(id, { ...util.defaultCard(id), missing: true });
  }

  searchCard(property, value) {
    return this.cards.filter((card) =>
      card[property]
        ?.toString()
        .toLowerCase()
        .replace(/[\W_ ]/g, '')
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

  exportCards = (filename) => {
    fs.writeFileSync(
      filename,
      this.cards
        .map((card) => (card.id + '\n').repeat(card.amount))
        .join('')
        .replace(/^\s+|\s+$/g, '')
    );
  };

  /* end of class*/
};

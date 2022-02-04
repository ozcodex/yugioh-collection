const loki = require("lokijs");
const dbfile = "main.db";
const db = new loki(dbfile);
let initialized = false;

function init() {
  return new Promise((resolve, reject) => {
    db.loadDatabase({}, (err) => {
      if (err) return reject(err);
      //create the collections
      if (db.getCollection("cards") === null)
        db.addCollection("cards", { unique: ["id"] });
      initialized = true;
      resolve();
    });
  });
}

function save() {
  return new Promise((resolve, reject) => {
    db.saveDatabase(function (err) {
      if (err) return reject();
      resolve();
    });
  });
}

function checkDb() {
  if (!initialized) return init();
  return Promise.resolve();
}

//function export

module.exports.addCard = (id,props) => {
  return checkDb().then(() => {
    let cards = db.getCollection("cards");
    cards.insert({ id, ...props });
    return save();
  });
}

module.exports.removeCard = (id) => {
  return checkDb().then(() => {
    let cards = db.getCollection("cards");
    cards.chain().find({ id }).remove();
    return save();
  });
}

module.exports.countCards = () => {
  return checkDb().then(() => {
    let cards = db.getCollection("cards");
    return cards.count();
  });
}

module.exports.findCard = (id) => {
  return checkDb().then(() => {
    let cards = db.getCollection("cards");
    return cards.findOne({id});
  });
}

module.exports.listCards = () => {
  return checkDb().then(() => {
    let cards = db.getCollection("cards");
    return cards.find();
  });
}
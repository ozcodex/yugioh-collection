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

module.exports.addCard = (id) => {
  return checkDb().then(() => {
    let cards = db.getCollection("cards");
    cards.insert({ id });
    return save();
  });
}


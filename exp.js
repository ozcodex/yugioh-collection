// this is an experiment
// the idea behind this experiment is to manage the card collection
// offline and using only node core libraries, without installing anything.
const fs = require("fs");
const all_cards = require("./all_cards.json").data;
const db = require("./db.json");

function parseId(id) {
  parts = id.split("-");
  if (parts.length === 1) return id;
  if (parts[1].length <= 3) return id;
  parts[1] = "-EN" + parts[1].substring(2);
  return parts.join("");
}

function getLang(id) {
  parts = id.split("-");
  if (parts.length === 1 || parts[1].length <= 3) return "EN";
  else return parts[1].substr(0, 2);
}

function cardInfo(id) {
  id = parseId(id);
  const card = all_cards.filter((card) =>
    card.card_sets?.some((set) => set.set_code === id)
  )[0];
  if (!card) return null;
  const set = card.card_sets.filter((set) => set.set_code === id)[0];
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
    price: set?.set_price,
    image: card.card_images[0].id,
  };
}

function readInputFile(filename) {
  return fs
    .readFileSync(filename)
    .toString()
    .split("\n")
    .map((line) => line.replace(/[^ -~]+/g, ""))
    .filter(line => line != '');
}

function saveDB() {
  fs.writeFileSync("db.json", JSON.stringify(db));
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
      lang: getLang(id),
    };
    return db[id];
  }
  db[id] = { id:parseId, amount:1 ,missing: true,lang:getLang(id) };
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
        let regex = /[\W_ ]/g
        if (card[property].toLowerCase().replace(regex,'').includes(value.toLowerCase().replace(regex,'')))
          result.push(card);
      }
    }
  }
  return result;
}

function loadFile(name){
  readInputFile(name).forEach((id) => addCard(id));
  saveDB();
}

//========================//

const args = process.argv.slice(2)
if (args.length == 0 || args[0] == '-h')
  console.info(`
Yugioh Collection Manager

  -l 
    list all cards in collection.

  -s property value [strict]
    search the cards containing the value in the property,
    stricts is a optional boolean and indicates if strict
    search should be used.

  -a filename
    adds the ids indicated in the filename to database

  -h
    shows this help
`)

switch(args[0]){
  case '-l':
    for(id in db){
      console.info(`  ${id}\t (x${db[id].amount}) ${db[id].name||""}`)
    }
    break;
  case '-a':
    let filename = args[1];
    if (fs.existsSync(filename)) loadFile(filename)
    else console.error("bad file")
    break;
}

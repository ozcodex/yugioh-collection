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

function averagePrice(prices) {
  let price = Object.values(prices);
  return (
    price.map((p) => parseFloat(p)).reduce((a, b) => a + b) / price.length
  ).toFixed(2);
}

function lowestPrice(prices) {
  let price = Object.values(prices);
  return Math.min(...price)
}

function cardInfo(id) {
  let p_id = parseId(id);
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
    price: averagePrice(card.card_prices[0]),
    price_low: lowestPrice(card.card_prices[0]),
    image: card.card_images[0].id,
  };
}

function readInputFile(filename) {
  return fs
    .readFileSync(filename)
    .toString()
    .split("\n")
    .map((line) => line.replace(/[^ -~]+/g, ""))
    .filter((line) => line != "");
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
  db[id] = { id: parseId, amount: 1, missing: true, lang: getLang(id), price: 0, price_low: 0 };
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
            .replace(regex, "")
            .includes(value.toString().toLowerCase().replace(regex, ""))
        )
          result.push(card);
      }
    }
  }
  return result;
}

function totalValue(){
  return Object.values(db).map(card=> (card.price||0)*card.amount).reduce((a,b) => a+b).toFixed(2)
}

function totalLowValue(){
  return Object.values(db).map(card=> (card.price_low||0)*card.amount).reduce((a,b) => a+b).toFixed(2)
}

function loadFile(name) {
  readInputFile(name).forEach((id) => addCard(id));
  saveDB();
}

//========================//

const args = process.argv.slice(2);

switch (args[0]) {
  case "-l":
    for (id in db) {
      console.info(`  ${id}\t (x${db[id].amount}) ${db[id].name || ""} $${db[id].price}`);
    }
    break;
  case "-i":
      console.info(`Total value: $${totalValue()}`)
      console.info(`Total low value: $${totalLowValue()}`)
    break;
  case '-c':
    card_id = args[1];
    if (card_id in db) {
      let card = db[card_id]
      for(key in card){
        value = card[key]
        separator = (key.length >= 8)? '\t':'\t\t'
        if (value) console.info(`${key}:${separator}${value}`)
      }
    }else{
      console.error(`${card_id} not found`)
    }
    break;
  case "-s":
    searchCard(args[1], args[2], args[3] == "true").forEach((card) =>
      console.info(`  ${id}\t (x${card.amount}) ${card.name || ""}`)
    );
    break;
  case "-a":
    filename = args[1];
    if (fs.existsSync(filename)) loadFile(filename);
    else console.error("bad file");
    break;
  case '-r':
    card_id = args[1];
    if (card_id in db) {
      if(--db[card_id].amount < 0){
        delete db[card_id]
        console.info(`${card_id} deleted from db`)
      }else{
        console.info(`${card_id} amount reduced`)
      }
      fs.appendFileSync('deleted.txt',card_id)
      saveDB();
    }else{
      console.error(`${card_id} not found`)
    }
    break;
  case '-d':
    card_id = args[1];
    if (card_id in db) {
      delete db[card_id]
      fs.appendFileSync('deleted.txt',card_id)
      console.info(`${card_id} deleted from db`)
      saveDB();
    }else{
      console.error(`${card_id} not found`)
    }
    break;
  case "-D":
    for (id in db) delete db[id];
    saveDB();
    console.info("Done!");
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

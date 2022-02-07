// this is an experiment
// the idea behind this experiment is to manage the card collection
// offline and using only node core libraries, without installing anything.
const fs = require("fs");
const all_cards = require("./all_cards.json").data;

function cardInfo(id) {
  const card = all_cards.filter((card) =>
    card.card_sets?.some((set) => set.set_code === id)
  )[0];
  if (!card) return null;
  const set = card.card_sets.filter(set => set.set_code === id)[0]
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
    image: card.card_images[0].id
  };
}

function readInputFile(filename) {
  return fs
    .readFileSync(filename)
    .toString()
    .split("\n")
    .map((line) => line.replace(/[^ -~]+/g, ""));
}

console.log(cardInfo("FOTB-EN043"));
console.log(cardInfo("YS15-ENF24"));
console.log(readInputFile('out.txt'))

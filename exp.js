// this is an experiment
// the idea behind this experiment is to manage the card collection
// offline and using only node core libraries, without installing anything.

const data = require("./all_cards.json").data;

function cardInfo(id) {
  let card = data.filter((card) =>
    card.card_sets?.some((set) => set.set_code == id)
  )[0];
  return {
    id: id,
    name: card.name,
  };
}

console.log(cardInfo("FOTB-EN043"));
console.log(cardInfo("YS15-ENF24"));
console.log(data[10])

const db = require("./db");
const request = require("./request");
const { prompt } = require("enquirer");
const fs = require('fs')

function addCard(id) {
	return db.findCard(id).then((card) => {
		if (card !== null) {
			card.amount = card.amount + 1 || 2;
			return db.updateCard(card).then(() => console.log(card));
		}
		return request.cardData(id).then((data) => {
			db.addCard(id, data).then(() => {
				console.log(data);
			});
		});
	});
}

function addMissingCard(id) {
	return db.findCard(id).then((card) => {
		if (card !== null) {
			card.amount = card.amount + 1 || 2;
			return db.updateCard(card).then(() => console.log(card));
		}
		return db.addCard(id, { missing: true }).then(() => {
			console.log("Card Added!");
		});
	});
}

function printCard(id) {
	return db.findCard(id).then((card) => {
		console.log(card);
	});
}

function deleteCard(id) {
	return db.removeCard(id).then((card) => {
		console.log("Card Deleted!");
	});
}

function mask(card) {
	let amount = "";
	if (card.amount && card.amount > 1) amount = `(${card.amount}x) `;
	return `${amount}${card.id} - ${card.name} [${card.rarity}]: $${card.average_price}`;
}

function listCards() {
	return db
		.listCards()
		.then((cards) => cards.map(mask).forEach((card) => console.log(card)));
}

function exportCollection() {
	return db
		.listCards()
		.then((cards) => {
      let out = cards.map(card => (card.id+'\n').repeat(card.amount||1)).join('')
      fs.writeFileSync('out.txt',out);
      console.log("done")
    });
}

function getCardsId() {
	return db.listCards().then((cards) => cards.map((card) => card.id));
}

function propsToString(object) {
	for (prop in object) object[prop] = String(object[prop]);
	return object;
}

function countCards() {
	return db.listCards().then((cards) => {
		console.log(
			"Total amount of cards:" +
				cards
					.map((card) => card.amount || 1)
					.reduce((prev, curr) => prev + curr)
		);
		console.log("Total registers:" + cards.length);
	});
}

function fetchCard(id) {
	return request.cardData(id).then(console.log);
}

function getTotalValue() {
	return db.listCards().then((cards) => {
		let total = cards
			.map((card) => (card.average_price || 1) * (card.amount || 1))
			.reduce((prev, curr) => prev + curr)
			.toFixed(2);
		console.log("The total value of the collection is: $" + total);
	});
}

// CLI functions

options = [
	"Add Card",
	"Set Prefix",
	"List Cards",
	"View Card",
	"Delete Card",
	"Fetch Card",
	"Count Cards",
	"Total Value",
	"Add Missing Card",
  "Export Collection",
	"Exit",
];

const menu = {
	type: "select",
	name: "option",
	message: "Main Menu",
	choices: options,
};

let prefix = "";

const card_input = {
	type: "input",
	name: "id",
	message: "Write the card number",
	format: (input) => prefix + input.toUpperCase(),
	result: (input) => prefix + input.toUpperCase(),
};

const prefix_input = {
	type: "input",
	name: "prefix",
	message: "Write the prefix",
	format: (input) => input.toUpperCase(),
	result: (input) => input.toUpperCase(),
};

const card_selector = {
	type: "autocomplete",
	name: "id",
	message: "Choose the card number",
	limit: 5,
	choices: getCardsId(),
};

async function mainLoop() {
	do {
		status = await prompt(menu)
			.then((answer) => {
				console.log("\033[2J");
				switch (answer.option) {
					case "Add Card":
						return prompt(card_input).then((input) => addCard(input.id));
					case "Set Prefix":
						return prompt(prefix_input).then((input) => {
							prefix = input.prefix;
							console.log("prefix set!");
						});
					case "List Cards":
						return listCards();
					case "View Card":
						return prompt(card_selector).then((input) => printCard(input.id));
					case "Delete Card":
						return prompt(card_selector).then((input) => deleteCard(input.id));
					case "Fetch Card":
						return prompt(card_input).then((input) => fetchCard(input.id));
					case "Count Cards":
						return countCards();
					case "Total Value":
						return getTotalValue();
					case "Add Missing Card":
						return prompt(card_input).then((input) => addMissingCard(input.id));
          case "Export Collection":
            return exportCollection();
					case "Exit":
						return Promise.resolve("stop");
				}
			})
			.catch(console.error);
	} while (status != "stop");
}

mainLoop();

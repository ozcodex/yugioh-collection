const db = require("./db");
const request = require("./request");
const { Input, Select } = require("enquirer");

function addCard(id) {
	db.findCard(id).then((card) => {
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

function findCard(id) {
	db.findCard(id).then((card) => {
		console.log(card);
	});
}

function mask(card) {
	let amount = "";
	if (card.amount && card.amount > 1) amount = `(${card.amount}x) `;
	return `${amount}${card.id} - ${card.name} [${card.rarity}]: $${card.average_price}`;
}

function listCards() {
	db.listCards().then((cards) =>
		cards.map(mask).forEach((card) => console.log(card))
	);
}

function countCards() {
	db.listCards().then((cards) => {
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
	request.cardData(id).then(console.log);
}

function getTotalValue() {
	db.listCards().then((cards) => {
		let total = cards
			.map((card) => card.average_price * (card.amount || 1))
			.reduce((prev, curr) => prev + curr)
			.toFixed(2);
		console.log("The total value of the collection is: $" + total);
	});
}

options = [
	"Add Card",
	"List Cards",
	"View Card",
	"Fetch Card",
	"Count Cards",
	"Total Value",
	"Exit",
];

const menu = new Select({
	message: "Main Menu",
	choices: options,
});

const card_input = new Input({
	message: "Write the card number",
	format: (input) => input.toUpperCase(),
	result: (input) => input.toUpperCase(),
});

menu
	.run()
	.then((answer) => {
		switch (answer) {
			case "Add Card":
				return card_input.run().then(addCard);
			case "List Cards":
				return listCards();
			case "View Card":
				return card_input.run().then(findCard);
			case "Fetch Card":
				return card_input.run().then(fetchCard);
			case "Count Cards":
				return countCards();
			case "Total Value":
				return getTotalValue();
			case "Exit":
				return Promise.resolve("bye");
		}
	})
	.catch(console.error);

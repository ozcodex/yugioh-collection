const db = require("./db");
const request = require("./request");
const { prompt, Input, Select, AutoComplete, Snippet } = require("enquirer");

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

function printCard(id) {
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

function getCardsId() {
	return db.listCards().then((cards) => cards.map((card) => card.id));
}

function editCard(id, new_values) {
	db.findCard(id)
		.then((card) => updateCard({ ...card, ...new_values }))
		.then(() => printCard(id));
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

// CLI functions

options = [
	"Add Card",
	"List Cards",
	"View Card",
	"Edit Card",
	"Fetch Card",
	"Count Cards",
	"Total Value",
	"Exit",
];

const menu = {
	type: "select",
	name: "option",
	message: "Main Menu",
	choices: options,
};

const card_input = {
	type: "input",
	name: "id",
	message: "Write the card number",
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

const card_editor = {
	type: "snippet",
	name: "new_values",
	required: true,
	inital: 'amount',
	message: "Fill the properties of the card",
	fields: [
		{ name: "amount", validate: (value) => Number.isInteger(parseInt(value)), result: value => parseInt(value) },
	],
	template: `id: \${id}\namount: \${amount}`,
	result: (answer) => answer,
};

prompt(menu)
	.then((answer) => {
		switch (answer.option) {
			case "Add Card":
				return prompt(card_input).then((input) => addCard(input.id));
			case "List Cards":
				return listCards();
			case "View Card":
				return prompt(card_selector).then((input) => printCard(input.id));
			case "Edit Card":
				return prompt(card_selector)
					.then((input) => db.findCard(input.id))
					.then((card) => prompt({ ...card_editor, values: card }))
					.then(console.log); //.then((card) => editCard(card.id, card.new_values));
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

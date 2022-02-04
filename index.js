const db = require("./db");
const request = require("./request");
const { Input, Select } = require("enquirer");

function addCard(id) {
	db.findCard(id).then((card) => {
		if (card !== null) {
			card.amount = card.amount + 1 || 2;
			return db.updateCard(card).then(() => console.log(card));
		}
		return request.data(id).then((data) => {
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

function listCards() {
	db.listCards().then((cards) => {
		console.log(cards);
	});
}

options = ["Add Card", "List Cards", "View Card", "Exit"];

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
			case "Exit":
				return Promise.resolve("bye");
		}
	})
	.catch(console.error);

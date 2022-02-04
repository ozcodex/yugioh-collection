const db = require("./db");
const request = require("./request");
const { Input, Select } = require("enquirer");

function addCard(id) {
	console.log("loading card info...");
	return request.data(id).then((data) => {
		db.addCard(id, data).then(() => {
			console.log(data);
		});
	});
}

function listCards() {
	db.listCards().then((cards) => {
		console.log(cards);
	});
}

options = ["Add Card", "List Cards", "Exit"];

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
			case "Exit":
				return Promise.resolve("bye");
		}
	})
	.catch(console.error);

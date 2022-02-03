const loki = require('lokijs');

const db = new loki('main.db');

db.loadDatabase({}, function(err) {
	databaseInitialize();
	runProgramLogic();
});

function databaseInitialize() {
	if (db.getCollection("cards") === null) {
		console.log("creating new db")
		db.addCollection('cards',{ unique: ["id"]})
	}
}

function runProgramLogic() {
	var cards = db.getCollection("cards");
	var cardsCount = cards.count();

	//cards.insert({ id: 'MGED-EN001'});

	let results = cards.find({});

	console.log(results)

	  db.saveDatabase(function(err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("saved... it can now be loaded or reloaded with up to date data");
    }
  });

}
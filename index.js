const db = require('./db');
const request = require('./request');

db.listCards().then(cards => {
	cards.forEach((card) => {
		request.data(card.id).then((data)=>{
			console.log(data)
		}).catch(console.error)
	})
})


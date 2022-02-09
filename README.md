# yugioh-collection
A simple script to keep track of my yugioh card collection

using ygo prices and pro decks apis

bugs to solve:
- printing issue
- list dont updates when add card
- cards without amount

features to implement:
- code refactor
- sort list by price, date or amount
- top 10 by price, amount,
- add stadistics about archetype, card type and rarity
- read decks from text file
- % completed of sets
- cards of each language
- cards of each rarity
- deck builder
- edit card
- check for missing cards
- fix search to show missing cards
- add validations and error handling
- add documentation
- increase verbose
- graphical interface

# source of data
the json files `all_cards.json` and `all_sets.json` are obtained
from this urls respectively:
- https://db.ygoprodeck.com/api/v7/cardinfo.php
- https://db.ygoprodeck.com/api/v7/cardsets.php

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
- change list for top 10
- convert count in stadistics
- add stadistics about archetype, card type and archetype
- read decks from text file
- add a price sum by ranges
- search by name
- sets info in db
- % completed of sets
- cards of each language
- amount of cards by name
- deck builder
- edit card
- update cards from internet
- check for missing cards
- fix list to show missing cards
- graphical interface

# source of data
the json files `all_cards.json` and `card_sets.json` are obtained
from this urls respectively:
- https://db.ygoprodeck.com/api/v7/cardinfo.php
- https://db.ygoprodeck.com/api/v7/cardsets.php

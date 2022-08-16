# yugioh-collection
A simple script to keep track of my yugioh card collection

using ygo prices and pro decks apis

features:
- posix-like argument interface, run with '-h' to see all available arguments
- allows to add and delete cards
- list all cards
- search cards by different properties
- fetch set information
- read ydk decks
- check deck percent completitude
- get cards prices
- get the percent of unique cards that is in collection, from all the existent cards
- have a local database of all cards and update it
- export all ids to a txt file
- load database from txt file
- pick a random card from collection

bugs to solve:
- printing issue
- list dont updates when add card
- cards without amount

features to implement:
- top 10 by price, amount, set completitude
- add stadistics about archetype, card type and rarity
- read decks from text file
- missing cards from set
- cards of each language
- cards of each rarity
- deck builder
- edit card (update)
- check for missing cards
- fix search to show missing cards
- add validations and error handling
- add documentation
- increase verbose
- graphical interface
- show inported cards info after import
- add single card to collection

# source of data
the json files `all_cards.json` and `all_sets.json` are obtained
from this urls respectively:
- https://db.ygoprodeck.com/api/v7/cardinfo.php
- https://db.ygoprodeck.com/api/v7/cardsets.php

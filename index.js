var vorpal = require('vorpal')();

var cities = ['Vandalia', 'Columbus'];
var characters = ['Nathaniel', 'Alyssa'];

vorpal
  .delimiter('gm$')
  .show();

vorpal
  .command('ls <type>', 'Shows a list')
  .autocomplete(['city', 'character'])
  .action(function(args, callback) {
    switch(args.type) {
      case 'city':
        for(var i = 0; i < cities.length; i++) {
          this.log(cities[i]);
        }
        break;
      case 'character':
        for(var i = 0; i < characters.length; i++) {
          this.log(characters[i]);
        }
        break
    }
    callback();
  });

vorpal
  .command('add <type> <name>', 'Add an item')
  .autocomplete(['city', 'character'])
  .action(function(args, callback) {
    switch(args.type) {
      case 'city':
        cities.push(args.name);
        break;
      case 'character':
        characters.push(args.name);
        break;
    }
    callback();
  })

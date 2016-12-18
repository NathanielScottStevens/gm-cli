var vorpal = require('vorpal')();
var server = require('./server.js');

vorpal
  .delimiter('gm$')
  .show();

vorpal
  .command('ls <type>', 'Shows a list')
  .autocomplete(['cities', 'characters'])
  .action(function(args, callback) {
    switch(args.type) {
      case 'characters':
        return new Promise(function(resolve, reject) {
          server.getAll('characters', function(items) {
            vorpal.log('***** CHARACTERS *****');
            for(var i = 0; i < items.length; i++) {
              vorpal.log(items[i]);
            }
            resolve();
          });
        });
      case 'cities':
        return new Promise(function(resolve, reject) {
          server.getAll('cities', function(items) {
            vorpal.log('***** CITIES *****');
            for(var i = 0; i < items.length; i++) {
              vorpal.log(items[i]);
            }
            resolve();
          });
        });
    }
    callback();
  });

vorpal
  .command('add city <name>', 'Add a city')
  .action(function(args, callback) {
    server.insertNew('cities', args.name);
    callback();
  });

vorpal
  .command('add character <name>', 'Add a city')
  .option('-a, --age <age>', 'Age of character.')
  .action(function(args, callback) {
    server.insertNew('characters', {
      name: args.name,
      age: args.options.age,
    });
    callback();
  });

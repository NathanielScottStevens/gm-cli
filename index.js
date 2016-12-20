var vorpal = require('vorpal')();
var cliff = require('cliff');

var server = require('./server.js');
var skills = require('./skills.js');

function logHeader(text) {
  vorpal.log('******** ' + text.toUpperCase() + ' ********');
  vorpal.log('');
}

vorpal
  .delimiter('gm$')
  .show();

vorpal
  .command('ls <type>', 'Shows a list')
  .autocomplete(['cities', 'characters', 'skills'])
  .action(function(args, callback) {
    switch(args.type) {
      case 'characters':
        return new Promise(function(resolve, reject) {
          server.getAll('characters', function(items) {
            logHeader('characters');
            vorpal.log(cliff.stringifyObjectRows(items, ['_id', 'age', 'gender', 'location']));
            resolve();
          });
        });
      case 'cities':
        return new Promise(function(resolve, reject) {
          server.getAll('cities', function(items) {
            logHeader('cities');
            vorpal.log(cliff.stringifyObjectRows(items, ['_id', 'population']));
            resolve();
          });
        });
      case 'skills':
        logHeader('skills');
        this.log(cliff.stringifyObjectRows(skills, ['_id', 'attribute']));
        break;
    }
    callback();
  });

vorpal
  .command('add city <name>', 'Add a city')
  .option('-p, --population <level>', 'Population of city')
  .action(function(args, callback) {
    server.insertNew('cities', {
      _id: args.name,
      population: args.options.population,
    });
    callback();
  });

vorpal
  .command('add character <name>', 'Add a city')
  .option('-a, --age <age>', 'Age of character.')
  .option('-f, --female', 'Sets gender to female. Defaults to male.')
  .option('-l, --location <location>', 'Location of character.')
  .action(function(args, callback) {
    server.insertNew('characters', {
      _id: args.name,
      age: args.options.age,
      gender: args.options.female ? 'f' : 'm',
      location: args.options.location,
    });
    this.log(args);
    callback();
  });

vorpal
  .command('push <collection> <id> <property> <value>', 'Pushes value to field')
  .action(function(args, callback) {
    server.push(args.collection, args.id, args.property, args.value);
    callback();
  });

vorpal
  .command('set <collection> <id> <property> <value>', 'Edit key value pair.')
  .autocomplete(['cities', 'characters'])
  .action(function(args, callback) {
    server.update(args.collection, args.id, args.property, args.value);
    callback();
  });

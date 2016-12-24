var vorpal = require('vorpal')();
var cliff = require('cliff');
var cliFormat = require('cli-format');
var pad = require('pad');

var server = require('./server.js');
var skills = require('./skills.js');

function logHeader(text) {
  vorpal.log('******** ' + text.toUpperCase() + ' ********');
}

function viewCharacter(character) {
  logHeader(character._id.replace('_', ' '));
  vorpal.log('');
  vorpal.log(pad('Strength', 12) + pad(character.strength.toString(), 5));
  vorpal.log(pad('Agility', 12) + pad(character.agility.toString(), 5));
  vorpal.log(pad('Spirit', 12) + pad(character.spirit.toString(), 5));
  vorpal.log(pad('Smarts', 12) + pad(character.smarts.toString(), 5));
  vorpal.log(pad('Vigor', 12) + pad(character.vigor.toString(), 5));
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
  .option('-p, --population <level>', 'Population of city.')
  .option('-r, --region <region>', 'Region of city.')
  .action(function(args, callback) {
    server.insertNew('cities', {
      _id: args.name,
      population: args.options.population,
    });
    callback();
  });

  vorpal
    .command('add region <name>', 'Add a region')
    .action(function(args, callback) {
      server.insertNew('regions', {
        _id: args.name,
      });
      callback();
    });


vorpal
  .command('add character <name>', 'Add a character')
  .option('-a, --age <age>', 'Age of character.')
  .option('-f, --female', 'Sets gender to female. Defaults to male.')
  .option('-l, --location <location>', 'Location of character.')
  .option('-str, --strength <dieType>', 'Strenth of character.')
  .option('--agility <dieType>', 'Strenth of character.')
  .option('--smarts <dieType>', 'Strenth of character.')
  .option('--spirit <dieType>', 'Strenth of character.')
  .option('--vigor <dieType>', 'Strenth of character.')
  .action(function(args, callback) {
    server.insertNew('characters', {
      _id: args.name,
      age: args.options.age,
      gender: args.options.female ? 'f' : 'm',
      location: args.options.location,
      strength: args.options.strength ? args.options.strength : 6,
      agility: args.options.agility ? args.options.agility : 6,
      smarts: args.options.smarts ? args.options.smarts : 6,
      spirit: args.options.spirit ? args.options.spirit : 6,
      vigor: args.options.vigor ? args.options.vigor : 6,
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
  .autocomplete(['cities', 'characters', 'regions'])
  .action(function(args, callback) {
    server.update(args.collection, args.id, args.property, args.value);
    callback();
  });

vorpal
  .command('view character <id>', 'View character.')
  .action(function(args, callback) {
    server.get('characters', args.id, function(character) {
      viewCharacter(character);
    });
  });

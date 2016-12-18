var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/gm';
var server;

module.exports.insertNew = function (collection, object) {
  MongoClient.connect(url, function(err, db) {
    var collectionRef = db.collection(collection);
    collectionRef.insert(object);

    db.close();
  });
};

module.exports.getAll = function(collection, callback) {
  MongoClient.connect(url, function(err, db) {
    var collectionRef = db.collection(collection);
    collectionRef.find().toArray(function(err, items) {
      if (err) {
        console.log(err);
      }
      callback(items);
    });

    db.close();
  });
}

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var vorpal = require('vorpal')();

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
        vorpal.log(err);
      }
      callback(items);
    });

    db.close();
  });
}

module.exports.get = function(collection, id, callback) {
  MongoClient.connect(url, function(err, db) {
    var collectionRef = db.collection(collection);
    collectionRef.findOne({ _id: id }, function(err, obj) {
      if (err) {
        vorpal.log(err);
      } else {
        callback(obj);
      }

      db.close();
    });
  });
}

module.exports.update = function(collection, id, property, value) {
  MongoClient.connect(url, function(err, db) {
    var collectionRef = db.collection(collection);
    var set = {};
    set[property] = value;
    collectionRef.update(
      { _id: id },
      { $set: set }
    );
    db.close();
  });
}

module.exports.push = function(collection, id, property, value) {
  MongoClient.connect(url, function(err, db) {
    var collectionRef = db.collection(collection);
    var set = {};
    set[property] = value;
    collectionRef.update(
      { _id: id },
      { $push: set }
    );
    db.close();
  });
}

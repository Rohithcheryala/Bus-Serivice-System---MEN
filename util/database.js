const MongoClient = require('mongodb').MongoClient;
const path = require('path');
require('dotenv').config();

let _db;

exports.mongoConnect = (callback) => {
  MongoClient.connect(
    process.env.URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, client) {
      console.log('Connected successfully to server');
      _db = client.db(process.env.DBNAME);
      return callback(err);
    }
  );
};

exports.getDb = () => {
  return _db;
};

exports.closeDb = () => {
  _db.close();
};

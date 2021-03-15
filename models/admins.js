const mongodb = require('mongodb');
const Joi = require('joi');
const getDb = require('../util/database').getDb;

class Admin {
  static check(query) {
    const db = getDb();
    return db
      .collection('admins')
      .findOne(query)
      .then((admin) => admin)
      .catch((err) => {
        console.log('admin count =>' + err);
      });
  }

  static makeAdmin(userId) {
    db.collection('users')
      .findOneAndDelete({ _id: mongodb.ObjectId(userId) })
      .then((user) => {
        // remove _id , it may cause troble
        db.collection('admins').insertOne(user);
      });
  }
}

module.exports = Admin;

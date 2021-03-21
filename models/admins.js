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
    const db = getDb();
    return db
      .collection('users')
      .findOneAndDelete({ _id: mongodb.ObjectId(`${userId}`) })
      .then((user) => {
        // remove _id , it may cause troble
        if (user.value) {
          return db
            .collection('admins')
            .insertOne(user.value)
            .then((user) => {
              return;
            });
        } else {
          return;
        }
      });
  }

  static fetchAllUsers() {
    const db = getDb();
    return db
      .collection('users')
      .find({})
      .sort({ username: 1 })
      .toArray()
      .then((allUsersArray) => {
        return allUsersArray;
      })
      .catch((err) => {
        console.log(`admin fetchAllUsers error: ${err}`);
      });
  }
}

module.exports = Admin;

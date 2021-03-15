const mongodb = require('mongodb');
const Joi = require('joi');
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
    this._id = new mongodb.ObjectID();
  }

  static validateUser(user) {
    const UserSchema = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      _id: Joi.any(),
    });
    return UserSchema.validate(user);
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .then(() => {
        console.log('new user saved');
      })
      .catch((err) => {
        console.log('user save =>' + err);
      });
  }

  update() {}

  static check(query) {
    const db = getDb();
    return db
      .collection('users')
      .findOne(query)
      .then((user) => user)
      .catch((err) => {
        console.log(`user check => ${err}`);
      });
  }
}

module.exports = User;

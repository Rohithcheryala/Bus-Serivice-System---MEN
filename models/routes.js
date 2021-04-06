const mongodb = require('mongodb');
// const Joi = require('joi');
const getDb = require('../util/database').getDb;

class Route {
  constructor(name, stopsArr) {
    this.name = name || `${stopsArr[0]} to ${stopsArr[stopsArr.length - 1]}`;
    stopsArr = stopsArr.filter((stop) => stop !== '');
    this.stopsArr = stopsArr;
  }
}

class Map {
  static addRoute(route) {
    const db = getDb();
    return db.collection('routes').insertOne(route);
  }

  static fetchAllRoutes() {
    const db = getDb();
    return db
      .collection('routes')
      .find({})
      .toArray()
      .then((arr) => arr)
      .catch((err) => {
        console.log(`map fetchAllRoutes error: ${err}`);
      });
  }

  static deleteRoute(routeId) {
    const db = getDb();
    return db.collection('routes').deleteOne({ _id: routeId });
  }

  static disableRoute(routeId) {
    const db = getDb();
    db.collection('config')
      .findOneAndDelete({ disableRoute: true })
      .then((configfile) => {
        configfile.disableRoutes.append(routeId);
        db.collection('config').insertOne(configfile);
      });
  }

  static enableRoute(routeId) {
    const db = getDb();
    db.collection('config')
      .findOneAndDelete({ disableRoute: true })
      .then((configfile) => {
        configfile.disableRoutes = configfile.disableRoutes.filter(
          (Id) => Id !== routeId
        );
        db.collection('config').insertOne(configfile);
      });
  }
}

module.exports = { Map, Route };

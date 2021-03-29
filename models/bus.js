const mongodb = require('mongodb');
const Joi = require('joi');
const getDb = require('../util/database').getDb;
const seatsArr = require('../util/seatsArr');

class Bus {
  constructor(fromplace, fromdate, fromtime, toplace, todate, totime, stops) {
    const defineStatus = (stops) => {
      let status = [];
      // stops - 1 number of arrays
      for (let i = 0; i < stops.length - 1; i++) {
        status.push(seatsArr(40));
      }
      return status;
    };
    this.from = {
      place: fromplace,
      date: fromdate,
      time: fromtime,
    };
    this.to = {
      place: toplace,
      date: todate,
      time: totime,
    };
    this.allStops = stops;
    this.status = defineStatus(stops);
    this._id = new mongodb.ObjectID();
  }

  static validateTrip(trip) {
    const TripSchema = Joi.object({
      from: Joi.object({
        place: Joi.string().required(),
        date: Joi.string().required(),
        time: Joi.string().required(),
      }).required(),
      to: Joi.object({
        place: Joi.string().required(),
        date: Joi.string().required(),
        time: Joi.string().required(),
      }).required(),
      allStops: Joi.array().required(),
      status: Joi.array().required(),
      _id: Joi.any(),
    });
    return TripSchema.validate(trip);
  }

  static fetchAllTrips(busNo) {
    const db = getDb();
    return mongodb.Db.collection(busNo)
      .find({})
      .toArray()
      .then((tripsArr) => tripsArr)
      .catch((err) => {
        console.log(`err bus fetchAllTrips ${err}`);
      });
  }

  static addTrip(busNo, trip) {
    const db = getDb();
    // TODO  check if its possible (may be hard)
    return db
      .collection(busNo)
      .insertOne(trip)
      .then(() => true)
      .catch((err) => {
        console.log(`bus addTrip ${err}`);
      });
  }

  static isNewBusno(busNo) {
    const db = getDb();
    return db
      .listCollections()
      .toArray()
      .then((arr) => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].name == busNo) {
            return 'false';
          }
        }
      })
      .then((result) => {
        if (result === 'false') {
          return false;
        } else {
          return true;
        }
      })
      .catch((err) => {
        console.log(`bus isNewBusno err ${err}`);
      });
  }
}

module.exports = Bus;

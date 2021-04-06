const mongodb = require('mongodb');
const Joi = require('joi');
const getDb = require('../util/database').getDb;
const seatsArr = require('../util/seatsArr');

class Trip {
  constructor(
    route,
    fromplace,
    toplace,
    first,
    dpdatefirst,
    dptimefirst,
    ardatefirst,
    artimefirst,
    stop1,
    dpdatestop1,
    dptimestop1,
    ardatestop1,
    artimestop1,
    stop2,
    dpdatestop2,
    dptimestop2,
    ardatestop2,
    artimestop2,
    stop3,
    dpdatestop3,
    dptimestop3,
    ardatestop3,
    artimestop3,
    stop4,
    dpdatestop4,
    dptimestop4,
    ardatestop4,
    artimestop4,
    stop5,
    dpdatestop5,
    dptimestop5,
    ardatestop5,
    artimestop5,
    last,
    dpdatelast,
    dptimelast,
    ardatelast,
    artimelast
  ) {
    const defineStatus = (len) => {
      let status = [];
      for (let i = 0; i < len - 1; i++) {
        status.push(seatsArr(40));
      }
      return status;
    };
    this.route = route;
    this.from = fromplace;
    this.to = toplace;
    // this.allStops = stops;
    this.Stops = [];
    ['first', 'stop1', 'stop2', 'stop3', 'stop4', 'stop5', 'last'].forEach(
      (node) => {
        if (eval(node)) {
          this.Stops.push({
            name: eval(node),
            arrival: {
              date: eval('ardate' + node),
              time: eval('artime' + node),
            },
            departure: {
              date: eval('dpdate' + node),
              time: eval('dptime' + node),
            },
          });
        }
      }
    );
    this.status = defineStatus(this.Stops.length);
    this._id = new mongodb.ObjectID();
  }

  validate() {
    const TripSchema = Joi.object({
      route: Joi.string().required(),
      from: Joi.string().required(),
      to: Joi.string().required(),
      Stops: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          arrival: Joi.object({
            date: Joi.string().required(),
            time: Joi.string().required(),
          }).required(),
          departure: Joi.object({
            date: Joi.string().required(),
            time: Joi.string().required(),
          }).required(),
        })
      ),
      status: Joi.array().required(),
      _id: Joi.any(),
    });
    return TripSchema.validate(this);
  }
}

class Bus {
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

module.exports = { Bus, Trip };

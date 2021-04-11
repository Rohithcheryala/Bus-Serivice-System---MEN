const mongodb = require('mongodb');
const Joi = require('joi');
const getDb = require('../util/database').getDb;
const seatsArr = require('../util/seatsArr');
/* ****************************************************************************************************** */
const GetStatus = (inp, fromIndex, toIndex) => {
  let seatIs = [];
  let status = [];
  // fromIndex to  toIndex - 1;
  let statusIndices = [];
  for (let i = fromIndex; i <= toIndex - 1; i++) {
    statusIndices.push(i);
  }
  for (let i = 0; i < 40; i++) {
    seatIs = [];
    statusIndices.forEach((index) => {
      seatIs.push(inp[index][i]);
    });
    if (seatIs.includes('f')) {
      status.push('f');
    } else {
      status.push('e');
    }
  }
  return status;
};
const GetIndices = (inp, fromplace, toplace) => {
  return new Promise((resolve, reject) => {
    let fromIndex = 100;
    let toIndex = -1;
    for (let i = 0; i < inp.Stops.length; i++) {
      if (inp.Stops[i].name === fromplace) {
        fromIndex = i;
      } else if (inp.Stops[i].name === toplace) {
        toIndex = i;
        resolve([fromIndex, toIndex]);
        return [fromIndex, toIndex];
      }
    }
  });
};
/* ****************************************************************************************************** */
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

  static addThisBusNumber(busNo) {
    const db = getDb();
    return db
      .collection('busNumbers')
      .findOneAndDelete({})
      .then((doc) => {
        doc.busNumbers.push(busNo);
        return db
          .collection('busNumbers')
          .insertOne(doc)
          .then(() => {})
          .catch((err) => {
            console.log(`bus addThisBusNumber err2 ${err}`);
          });
      })
      .catch((err) => {
        console.log(`bus addThisBusNumber err1 ${err}`);
      });
  }

  static removeThisBusNumber(busNo) {
    const db = getDb();
    return db
      .collection('busNumbers')
      .findOneAndDelete({})
      .then((doc) => {
        doc.busNumbers = doc.busNumbers.filter((item) => item !== value);
        return db
          .collection('busNumbers')
          .insertOne(doc)
          .then(() => {})
          .catch((err) => {
            console.log(`bus removeThisBusNumber err2 ${err}`);
          });
      })
      .catch((err) => {
        console.log(`bus removeThisBusNumber err1 ${err}`);
      });
  }

  static fetchTrips(fromplace, fromdate, toplace) {
    /* const TrimData = (inp, fromplace, toplace) => {
      let promise = new Promise((resolve, reject) => {
        let fromIndex = 100;
        let toIndex = -1;
        for (let i = 0; i < inp.Stops.length; i++) {
          if (inp.Stops[i].name === fromplace) {
            fromIndex = i;
          } else if (inp.Stops[i].name === toplace) {
            toIndex = i;
            resolve([fromIndex, toIndex]);
            return [fromIndex, toIndex];
          }
        }
      });
      return promise.then(([fromIndex, toIndex]) => {
        if (fromIndex > toIndex) {
          // console.log('wrrrrrrrrrr');
          return {};
        }
        let out = {
          busNo: inp.busNo,
          route: inp.route,
          _id: inp._id,
          from: {
            place: fromplace,
            date: inp.Stops[fromIndex].departure.date,
            time: inp.Stops[fromIndex].departure.time,
          },
          to: {
            place: toplace,
            date: inp.Stops[toIndex].arrival.date,
            time: inp.Stops[toIndex].arrival.time,
          },
          status: GetStatus(inp.status, fromIndex, toIndex),
        };
        return out;
      });
    }; */
    const query = {
      $and: [
        { 'Stops.name': fromplace },
        { 'Stops.arrival.date': fromdate },
        { 'Stops.name': toplace },
      ],
    };
    const db = getDb();
    let promises = [];
    return db
      .collection('busNumbers')
      .findOne({})
      .then((doc) => {
        doc.busNumbers.forEach((busNo) => {
          promises.push(
            db
              .collection(busNo)
              .find(query, {
                projection: {
                  // status: 0,
                  from: 0,
                  to: 0,
                },
              })
              .toArray()
              .then((results) => {
                results.forEach((result) => {
                  result.busNo = busNo;
                });
                return results;
              })
              .catch((err) => {
                console.log(`bus fetchTripsByQuery error: ${err}`);
              })
          );
        });
        return Promise.all(promises);
      })
      .then((allResults) => {
        allResults = [].concat.apply([], allResults);
        promises = [];
        for (let i = 0; i < allResults.length; i++) {
          promises.push(
            // TrimData(allResults[i], fromplace, toplace).then((out) => out)
            GetIndices(allResults[i], fromplace, toplace).then(
              ([fromIndex, toIndex]) => {
                if (fromIndex >= toIndex) {
                  return {};
                } else {
                  return {
                    busNo: allResults[i].busNo,
                    route: allResults[i].route,
                    _id: allResults[i]._id,
                    from: {
                      place: fromplace,
                      date: allResults[i].Stops[fromIndex].departure.date,
                      time: allResults[i].Stops[fromIndex].departure.time,
                    },
                    to: {
                      place: toplace,
                      date: allResults[i].Stops[toIndex].arrival.date,
                      time: allResults[i].Stops[toIndex].arrival.time,
                    },
                  };
                }
              }
            )
          );
        }
        return Promise.all(promises);
      })
      .then((editedResults) => {
        editedResults = [].concat.apply([], editedResults);
        editedResults = editedResults.filter(
          (result) => Object.keys(result).length !== 0 // result.toString() !== '[object Object]'
        );
        return editedResults;
      })
      .catch((err) => {
        console.log(`bus fetchTrips err: ${err}`);
      });
  }

  static fetchATrip(busNo, docId, fromplace, fromdate, toplace) {
    const db = getDb();
    return db
      .collection(busNo)
      .findOne({ _id: mongodb.ObjectId(docId) })
      .then((result) => {
        return GetIndices(result, fromplace, toplace).then(
          ([fromIndex, toIndex]) => {
            return {
              busNo: result.busNo,
              route: result.route,
              _id: result._id,
              from: {
                place: fromplace,
                date: result.Stops[fromIndex].departure.date,
                time: result.Stops[fromIndex].departure.time,
              },
              to: {
                place: toplace,
                date: result.Stops[toIndex].arrival.date,
                time: result.Stops[toIndex].arrival.time,
              },
              status: GetStatus(result.status, fromIndex, toIndex),
            };
          }
        );
      })
      .catch((err) => {
        console.log(`Bus fetchATrip err: ${err}`);
      });
  }
}

module.exports = { Bus, Trip };

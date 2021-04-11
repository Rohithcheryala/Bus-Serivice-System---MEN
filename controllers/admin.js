const Admin = require('../models/admins.js');
const { Bus, Trip } = require('../models/bus.js');
const { Map, Route } = require('../models/routes.js');

exports.get_index = (req, res, next) => {
  res.render('./admin/index.ejs', {
    title: 'Admin index',
    loggedIn: true,
    role: 'admin',
  });
};

exports.get_search = (req, res, next) => {
  res.render('../views/search.ejs', {
    title: 'search page',
    role: 'admin',
    loggedIn: true,
  });
};

exports.post_search = (req, res, next) => {
  const { fromplace, toplace, fromdate } = req.body;
  Bus.fetchTrips(
    // $and: [
    //   { 'Stops.name': fromplace },
    //   { 'Stops.arrival.date': fromdate },
    //   { 'Stops.name': toplace },
    // ],
    fromplace,
    fromdate,
    toplace
  )
    .then((results) => {
      res.render('../views/search.ejs', {
        title: 'Admin search',
        role: 'admin',
        loggedIn: true,
        results: results,
      });
      // res.json(results);
    })
    .catch((err) => {
      console.log(`Admin post_search error: ${err}`);
    });
};

exports.get_activities = (req, res, next) => {
  res.render('./admin/activities.ejs', {
    title: 'Admin activities',
    loggedIn: true,
    role: 'admin',
  });
};

exports.get_addAdmin = (req, res, next) => {
  Admin.fetchAllUsers()
    .then((allUsersArr) => {
      res.render('./admin/addAdmin.ejs', {
        title: 'Admin AddAdmin',
        loggedIn: true,
        role: 'admin',
        allUsersArr: allUsersArr,
      });
    })
    .catch((err) => {
      console.log(`admin get_addAdmin error: ${err}`);
    });
};

exports.post_addAdmin = (req, res, next) => {
  const Id = req.body.id;
  // should parse the string as we added username and email an the id
  const [userId, username, email] = Id.split('-');
  let promises = [];
  promises.push(
    Admin.fetchAllUsers()
      .then((allUsersArr) => allUsersArr)
      .catch((err) => {
        console.log(`admin post_addAdmin1 error: ${err}`);
      })
  );
  promises.push(
    Admin.makeAdmin(userId)
      .then(() => {
        return;
      })
      .catch((err) => {
        console.log(`admin post_addAdmin2 error: ${err}`);
      })
  );

  // * if 2nd promise ends first we may miss a user(the present user)
  // * i want to show the user with a tick mark
  // * indicating he is now an admin
  // * also want to fade-out this user after a time limit say 10sec
  // ! i think its not necessary, its always done underhood
  Promise.all(promises).then((resultsArr) => {
    res.render('./admin/addAdmin.ejs', {
      title: 'Admin AddAdmin',
      loggedIn: true,
      role: 'admin',
      allUsersArr: resultsArr[0],
      newAdminId: userId,
      username: username,
      email: email,
    });
  });
};

exports.get_addRoute = (req, res, next) => {
  res.render('./admin/addRoute.ejs', {
    title: 'Admin AddRoute',
    loggedIn: true,
    role: 'admin',
  });
};

exports.post_addRoute = (req, res, next) => {
  const { name, from, stop1, stop2, stop3, stop4, stop5, to } = req.body;
  const route = new Route(name, [from, stop1, stop2, stop3, stop4, stop5, to]);
  Map.addRoute(route)
    .then(() => {
      res.render('./admin/addRoute.ejs', {
        title: 'Admin AddRoute',
        loggedIn: true,
        role: 'admin',
      });
    })
    .catch((err) => {
      console.log(`admin post_addRoute err ${err}`);
    });
};

exports.get_addBus = (req, res, next) => {
  Map.fetchAllRoutes().then((routesArray) => {
    res.render('../views/admin/addBus.ejs', {
      title: 'Add Bus',
      loggedIn: true,
      role: 'admin',
      routes: routesArray,
    });
  });
};

exports.post_addBus = (req, res, next) => {
  const {
    busno,
    route,
    fromplace,
    toplace,
    first,
    ardatefirst,
    artimefirst,
    dpdatefirst,
    dptimefirst,
    stop1,
    ardatestop1,
    artimestop1,
    dpdatestop1,
    dptimestop1,
    stop2,
    ardatestop2,
    artimestop2,
    dpdatestop2,
    dptimestop2,
    stop3,
    ardatestop3,
    artimestop3,
    dpdatestop3,
    dptimestop3,
    stop4,
    ardatestop4,
    artimestop4,
    dpdatestop4,
    dptimestop4,
    stop5,
    ardatestop5,
    artimestop5,
    dpdatestop5,
    dptimestop5,
    last,
    ardatelast,
    artimelast,
    dpdatelast,
    dptimelast,
  } = req.body;
  // if a collection with name busno already exists, show err
  Bus.isNewBusno(busno).then((bool) => {
    if (!bool) {
      res.send('errrrrrrr');
    } else {
      // add this busno to busNumbers collection
      Bus.addThisBusNumber(busno)
        .then(() => {})
        .catch((err) => {
          console.log(`admin addingBusNo error: ${err}`);
        });
      let trip = new Trip(
        route,
        fromplace,
        toplace,
        first,
        ardatefirst,
        artimefirst,
        dpdatefirst,
        dptimefirst,
        stop1,
        ardatestop1,
        artimestop1,
        dpdatestop1,
        dptimestop1,
        stop2,
        ardatestop2,
        artimestop2,
        dpdatestop2,
        dptimestop2,
        stop3,
        ardatestop3,
        artimestop3,
        dpdatestop3,
        dptimestop3,
        stop4,
        ardatestop4,
        artimestop4,
        dpdatestop4,
        dptimestop4,
        stop5,
        ardatestop5,
        artimestop5,
        dpdatestop5,
        dptimestop5,
        last,
        ardatelast,
        artimelast,
        dpdatelast,
        dptimelast
      );
      const response = trip.validate();
      if (!response.error) {
        Bus.addTrip(busno, trip)
          .then(() => {
            res.send('success');
            // res.render('../views/admin/addBus.ejs', {
            //   title: 'Add Bus',
            //   loggedIn: true,
            //   role: 'admin',
            //   successMsg: true,
            // });
          })
          .catch((err) => {
            console.log(`admin post_addTrip error: ${err}`);
          });
      }
    }
  });
};

exports.get_addTrip = (req, res, next) => {
  Map.fetchAllRoutes().then((routesArray) => {
    res.render('../views/admin/addTrip.ejs', {
      title: 'Add Trip',
      loggedIn: true,
      role: 'admin',
      routes: routesArray,
    });
  });
};

exports.post_addTrip = (req, res, next) => {
  const {
    busno,
    route,
    fromplace,
    toplace,
    first,
    ardatefirst,
    artimefirst,
    dpdatefirst,
    dptimefirst,
    stop1,
    ardatestop1,
    artimestop1,
    dpdatestop1,
    dptimestop1,
    stop2,
    ardatestop2,
    artimestop2,
    dpdatestop2,
    dptimestop2,
    stop3,
    ardatestop3,
    artimestop3,
    dpdatestop3,
    dptimestop3,
    stop4,
    ardatestop4,
    artimestop4,
    dpdatestop4,
    dptimestop4,
    stop5,
    ardatestop5,
    artimestop5,
    dpdatestop5,
    dptimestop5,
    last,
    ardatelast,
    artimelast,
    dpdatelast,
    dptimelast,
  } = req.body;
  // if a collection with name busno doesnot exists, show err
  Bus.isNewBusno(busno).then((bool) => {
    console.log(busno, bool);
    if (bool) {
      res.send('errrrrrrr');
    } else {
      // let stops = [first];
      // for (let i = 1; i <= 5; i++) {
      //   if (eval(`stop${i}`)) {
      //     stops.push(eval(`stop${i}`));
      //   }
      // }
      // stops.push(last);
      let trip = new Trip(
        route,
        fromplace,
        toplace,
        first,
        ardatefirst,
        artimefirst,
        dpdatefirst,
        dptimefirst,
        stop1,
        ardatestop1,
        artimestop1,
        dpdatestop1,
        dptimestop1,
        stop2,
        ardatestop2,
        artimestop2,
        dpdatestop2,
        dptimestop2,
        stop3,
        ardatestop3,
        artimestop3,
        dpdatestop3,
        dptimestop3,
        stop4,
        ardatestop4,
        artimestop4,
        dpdatestop4,
        dptimestop4,
        stop5,
        ardatestop5,
        artimestop5,
        dpdatestop5,
        dptimestop5,
        last,
        ardatelast,
        artimelast,
        dpdatelast,
        dptimelast
      );
      const response = trip.validate();
      if (!response.error) {
        Bus.addTrip(busno, trip)
          .then(() => {
            res.send('success');
            // res.render('../views/admin/addBus.ejs', {
            //   title: 'Add Bus',
            //   loggedIn: true,
            //   role: 'admin',
            //   successMsg: true,
            // });
          })
          .catch((err) => {
            console.log(`admin post_addTrip error: ${err}`);
          });
      }
    }
  });
};

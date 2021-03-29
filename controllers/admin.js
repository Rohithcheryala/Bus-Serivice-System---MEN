const Admin = require('../models/admins.js');
const Bus = require('../models/bus.js');

exports.get_index = (req, res, next) => {
  res.render('./admin/index.ejs', {
    title: 'Admin index',
    loggedIn: true,
    role: 'admin',
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

exports.get_addBus = (req, res, next) => {
  res.render('../views/admin/addBus.ejs', {
    title: 'Add Bus',
    loggedIn: true,
    role: 'admin',
  });
};

exports.post_addBus = (req, res, next) => {
  const {
    busno,
    fromplace,
    fromdate,
    fromtime,
    toplace,
    todate,
    totime,
    first,
    stop1,
    stop2,
    stop3,
    stop4,
    stop5,
    last,
  } = req.body;
  // if a collection with name busno already exists, show err
  Bus.isNewBusno(busno).then((bool) => {
    if (!bool) {
      res.send('errrrrrrr');
    } else {
      let stops = [first];
      for (let i = 1; i <= 5; i++) {
        if (eval(`stop${i}`)) {
          stops.push(eval(`stop${i}`));
        }
      }
      stops.push(last);
      let trip = new Bus(
        fromplace,
        fromdate,
        fromtime,
        toplace,
        todate,
        totime,
        stops
      );
      const response = Bus.validateTrip(trip);
      if (!response.error) {
        Bus.addTrip(busno, trip)
          .then(() => {
            res.render('../views/admin/addBus.ejs', {
              title: 'Add Bus',
              loggedIn: true,
              role: 'admin',
              successMsg: true,
            });
          })
          .catch((err) => {
            console.log(`admin post_addTrip error: ${err}`);
          });
      }
    }
  });
};

exports.get_addTrip = (req, res, next) => {
  res.render('../views/admin/addTrip.ejs', {
    title: 'Add Bus',
    loggedIn: true,
    role: 'admin',
  });
};

exports.post_addTrip = (req, res, next) => {
  const {
    busno,
    fromplace,
    fromdate,
    fromtime,
    toplace,
    todate,
    totime,
    first,
    stop1,
    stop2,
    stop3,
    stop4,
    stop5,
    last,
  } = req.body;
  // if a collection with name busno doesnot exists, show err
  Bus.isNewBusno(busno).then((bool) => {
    if (bool) {
      res.send('errrrrrrr');
    } else {
      let stops = [first];
      for (let i = 1; i <= 5; i++) {
        if (eval(`stop${i}`)) {
          stops.push(eval(`stop${i}`));
        }
      }
      stops.push(last);
      let trip = new Bus(
        fromplace,
        fromdate,
        fromtime,
        toplace,
        todate,
        totime,
        stops
      );
      const response = Bus.validateTrip(trip);
      if (!response.error) {
        Bus.addTrip(busno, trip)
          .then(() => {
            res.render('../views/admin/addBus.ejs', {
              title: 'Add Bus',
              loggedIn: true,
              role: 'admin',
              successMsg: true,
            });
          })
          .catch((err) => {
            console.log(`admin post_addTrip error: ${err}`);
          });
      }
    }
  });
};

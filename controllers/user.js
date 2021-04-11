const { Bus, Trip } = require('../models/bus.js');

exports.get_index = (req, res, next) => {
  res.render('../views/user/index.ejs', {
    title: 'user index',
    role: 'user',
    loggedIn: true,
  });
};

exports.get_search = (req, res, next) => {
  const fromplace = req.query.fromplace;
  const fromdate = req.query.fromdate;
  const toplace = req.query.toplace;
  if (fromplace && toplace && fromdate) {
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
          title: 'User search',
          role: 'user',
          loggedIn: true,
          results: results,
          query: `?fromplace=${fromplace}&toplace=${toplace}&fromdate=${fromdate}`,
        });
        // res.json(results);
      })
      .catch((err) => {
        console.log(`User post_search error: ${err}`);
      });
  } else {
    res.render('../views/search.ejs', {
      title: 'User search',
      role: 'user',
      loggedIn: true,
    });
  }
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
        title: 'User search',
        role: 'user',
        loggedIn: true,
        results: results,
        query: `?fromplace=${fromplace}&toplace=${toplace}&fromdate=${fromdate}`,
      });
      // res.json(results);
    })
    .catch((err) => {
      console.log(`User post_search error: ${err}`);
    });
};

/* exports.get_bus = (req, res, next) => {
  const busNo = req.params.busNo;
  const docId = req.params.docId;
  // busNo should be passed as a parameter in url
  res.render('../views/bus.ejs', {
    title: 'Bus page',
    role: 'user',
    loggedIn: true,
  });
}; */

exports.get_bookTickets = (req, res, next) => {
  const busNo = req.params.busNo;
  const docId = req.params.docId;
  const fromplace = req.query.fromplace;
  const fromdate = req.query.fromdate;
  const toplace = req.query.toplace;
  Bus.fetchATrip(busNo, docId, fromplace, fromdate, toplace).then((result) => {
    res.render('../views/bus.ejs', {
      title: 'Bus page',
      role: 'user',
      loggedIn: true,
      data: result,
    });
    // res.json(result);
  });
};

exports.post_confirmTransaction = (req, res, next) => {
  res.json(req.body);
  let seats = [];
  Object.keys(req.body).forEach((key) => {
    if (parseInt(key)) {
      seats.push(parseInt(key));
    }
  });
  console.log(seats);
  // show a page confirming all the details and seat numbers.
};

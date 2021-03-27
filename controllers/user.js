exports.get_index = (req, res, next) => {
  res.render('../views/user/index.ejs', {
    title: 'user index',
    role: 'user',
    loggedIn: true,
  });
};

exports.get_search = (req, res, next) => {
  res.render('../views/search.ejs', {
    title: 'search page',
    role: 'user',
    loggedIn: true,
  });
};

exports.get_bus = (req, res, next) => {
  // busNo should be passed as a parameter in url
  res.render('../views/bus.ejs', {
    title: 'Bus page',
    role: 'user',
    loggedIn: true,
  });
};

exports.get_bookTickets = (req, res, next) => {
  res.send('in book page');
};

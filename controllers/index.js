exports.get_index = (req, res, next) => {
  res.render('index.ejs', { loggedIn: false });
};

exports.get_login = (req, res, next) => {
  res.render('login.ejs', { loggedIn: false });
};

exports.get_signup = (req, res, next) => {
  res.render('signup.ejs', { loggedIn: false });
};

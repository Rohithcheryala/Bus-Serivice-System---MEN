const bcrypt = require('bcrypt');

const User = require('../models/users.js');
const Admin = require('../models/admins.js');
const { response } = require('express');
exports.get_index = (req, res, next) => {
  res.render('index.ejs');
};

exports.get_login = (req, res, next) => {
  res.render('login.ejs', { loggedIn: false, title: 'login page' });
};

exports.post_login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.check({ email: email }).then((user) => {
    console.log(user);
    if (user) {
      // 'user' is the user document
      // todo: use jwt auth and place userId somewhere for further uses.
      bcrypt.compare(password, user.password).then((isSame) => {
        if (isSame) {
          res.redirect('/user');
        } else {
          res.render('./login.ejs', {
            title: 'LogIn Page',
            email: email,
            password: password,
            err: true,
          });
        }
      });
    } else {
      Admin.check({ email: email }).then((admin) => {
        if (admin) {
          // 'admin' is the admin document
          // todo: use jwt auth and place userId somewhere for further uses.
          res.redirect('/admin');
        } else {
          res.render('./login.ejs', {
            title: 'LogIn Page',
            email: email,
            password: password,
            err: true,
          });
        }
      });
    }
  });
};

exports.get_signup = (req, res, next) => {
  res.render('signup.ejs', { loggedIn: false, title: 'signup page' });
};

exports.post_signup = (req, res, next) => {
  // res.render('signup.ejs', { loggedIn: false });
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  User.check({ email: email }).then((userDetails) => {
    if (!userDetails) {
      // check in admin collections
      Admin.check({ email: email }).then((adminDetails) => {
        if (!adminDetails) {
          // not found in any collections, test passed
          // hashing password
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new User(username, email, hashedPassword);
              const response = User.validateUser(user);
              console.log(response);
              if (!response.error) {
                user
                  .save()
                  .then(() => {
                    // todo: use jwt auth and place userId somewhere for further uses.
                    res.redirect('/user');
                  })
                  .catch((err) => {
                    console.log(`post signup => ${err}`);
                  });
              } else {
                res.render('./login.ejs', {
                  title: 'signup Page',
                  username: username,
                  email: email,
                  err: true,
                });
              }
            })
            .catch((err) => {
              console.log(`post signup hash err => ${err}`);
            });
        } else {
          res.render('./login.ejs', {
            title: 'Log In P',
            username: username,
            email: email,
            err: true,
          });
        }
      });
    } else {
      res.render('./login.ejs', {
        title: 'Log In P',
        email: email,
        err: true,
      });
    }
  });
};

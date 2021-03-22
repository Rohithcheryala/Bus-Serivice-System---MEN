const Admin = require('../models/admins.js');

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

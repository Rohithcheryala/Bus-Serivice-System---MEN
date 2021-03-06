const express = require('express');

const router = express.Router();
const controller = require('../controllers/index.js');
// router.use(express.urlencoded({ extended: false }));

router.get('/', controller.get_index);

router
  .get('/login', controller.get_login)
  .post('/login', controller.post_login);

router
  .get('/signup', controller.get_signup)
  .post('/signup', controller.post_signup);

// router.use((req, res, next) => {
//   res.redirect('/login');
// });

module.exports = router;

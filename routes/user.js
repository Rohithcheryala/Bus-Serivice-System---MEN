const express = require('express');

const router = express.Router();
const controller = require('../controllers/user.js');
// router.use(express.urlencoded({ extended: false }));

router.get('/', controller.get_index);

router
  .get('/search', controller.get_search)
  .post('/search', controller.post_search);

router.get('/book/:busNo/:docId', controller.get_bookTickets);

router.post('/confirmTransaction', controller.post_confirmTransaction);

// router.get('/book/:docId', controller.get_bookTickets);

// router.use((req, res, next) => {
//   res.redirect('/login');
// });

module.exports = router;

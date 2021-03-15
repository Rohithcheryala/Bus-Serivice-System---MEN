const express = require('express');

const router = express.Router();
const controller = require('../controllers/user.js');
// router.use(express.urlencoded({ extended: false }));

router.get('/', controller.get_index);

// router.use((req, res, next) => {
//   res.redirect('/login');
// });

module.exports = router;

const express = require('express');

const router = express.Router();
const controller = require('../controllers/admin.js');
// router.use(express.urlencoded({ extended: false }));

router.get('/', controller.get_index);

router.get('/activities', controller.get_activities);

router
  .get('/addAdmin', controller.get_addAdmin)
  .post('/addAdmin', controller.post_addAdmin);
// router.use((req, res, next) => {
//   res.redirect('/login');
// });

module.exports = router;

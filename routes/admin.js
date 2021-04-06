const express = require('express');

const router = express.Router();
const controller = require('../controllers/admin.js');
// router.use(express.urlencoded({ extended: false }));

router.get('/', controller.get_index);

router.get('/search', controller.get_search);

router.get('/activities', controller.get_activities);

router
  .get('/addAdmin', controller.get_addAdmin)
  .post('/addAdmin', controller.post_addAdmin);

router
  .get('/addRoute', controller.get_addRoute)
  .post('/addRoute', controller.post_addRoute);

router
  .get('/addBus', controller.get_addBus)
  .post('/addBus', controller.post_addBus);

router
  .get('/addTrip', controller.get_addTrip)
  .post('/addTrip', controller.post_addTrip);
// router.use((req, res, next) => {
//   res.redirect('/login');
// });

module.exports = router;

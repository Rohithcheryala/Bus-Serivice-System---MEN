const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', 'views');

const mongo = require('./util/database.js');
const index = require('./routes/index.js');
const user = require('./routes/user.js');
const admin = require('./routes/admin.js');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/user', user);
app.use('/admin', admin);

mongo.mongoConnect((err, client) => {
  if (err) throw err;
  app.listen(process.env.PORT, () => {
    console.log(`listening at port ${process.env.PORT}`);
  });
});

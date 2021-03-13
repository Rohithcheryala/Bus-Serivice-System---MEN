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

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

mongo.mongoConnect((err, client) => {
  if (err) throw err;
  app.listen(process.env.PORT, () => {
    console.log(`listening at port ${process.env.PORT}`);
  });
});

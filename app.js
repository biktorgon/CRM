const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const logger = require('morgan');
const keys = require('./config/keys');
const app = express();

mongoose.connect(keys.mongoURI,{ useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(cors());
app.use(logger('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({extend: true}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/category', require('./routes/category'));
app.use('/api/order', require('./routes/order'));
app.use('/api/position', require('./routes/position'));

app.use((req, res) => res.status(404).send('Not found'));

module.exports = app;
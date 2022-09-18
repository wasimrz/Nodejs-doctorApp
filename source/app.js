require('dotenv');
const express = require('express');
const session = require('express-session');
const fs      = require('fs');
const path    = require('path');
const appLog  = require('morgan');

const cors    = require('cors');
const passport= require('./commons/auth/Passport');
const app     = express();

// cross origin
app.use(cors());

// a bit more security


// API docs
const swaggerUI    = require('swagger-ui-express');
const swaggerDoc   = require('./commons/meta/api-docs/swagger');

// api manual
app.use('/manual', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
//const helmet  = require('helmet');
//app.use(helmet());
app.set("view engine", "jade");
app.use(appLog('common', {
  stream: fs.createWriteStream(`./logs/${process.env.FILE_API_LOG}`, { flags: 'a' })
}));
app.use(appLog('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'i6lolr556x7' 
}));
app.use(passport.initialize());
app.use(passport.session());

// DB
require('./commons/models/initialize');

// Gateway controls
const RouteManager = require('./routes/routeManager');

// redirect to respsective apps
app.use('/', RouteManager);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.locals.message = 'Welcome to Doctor Dentist App';
  res.locals.error   = {
    status: 'Root Route',
    stack: 'You have called for root API or the API that you want does not exist',
  }
  res.render('error');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');
var calendar = require('./routes/calendar');
var todo = require('./routes/todo');
var random = require('./routes/random');
var org = require('./routes/org');

var app = express();



var DB_NAME = 'todoDB';
var DB_ADDRESS = 'mongodb://localhost:27017' // mongodb://roy:123456@104.198.230.211:27017

mongoose.Promise = global.Promise;
var db = mongoose.connect([DB_ADDRESS, DB_NAME].join('/')); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/calendar', calendar);
app.use('/todo', todo);
app.use('/random', random);
app.use('/org', org);

// offline tasks

// console.log('-----------');
var schedule = require('node-schedule');
var t = require('./tasks/tasks');
t.pushNoteViaMail();



// var job = schedule.scheduleJob('* */8 * * *', function() {
//   console.log('beep');
//   var t = require('./tasks/tasks');
//   t.pushNoteViaMail();
// });




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

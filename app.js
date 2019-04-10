var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//load routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var todos = require('./routes/todos'); //added Vincent load the router module
var todosRouters = require('./routes/todos')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); //this was the default 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // for images, css , javascripts

//use routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/todos', todos); //added Vincent
app.use('/todos', todosRouters)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
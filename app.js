var createError = require('http-errors');
var express = require('express');
//Add a require for express-handlebars to be able to use handlebars as the view engine code
var exphbs = require('express-handlebars');
//Add a require for Sass midlleware to be able to use Saas as the CSS pre processor
var sassMiddleware = require('node-sass-middleware');
//Browserify provides a module system for client side JavaScript.
//Much like using NPM modules in Node.js on the server,
//Browserify enables us to use NPM modules in Javascript on the browser.
//Using Browserify has multiple benefits:
//we can install and require() modules,
//it generates a single bundle js file with all the dependencies resolved,
//it promotes modular coding structure in our code as well.
//note: Instead of adding jQuery through a script tag like we did before,
//we will replace it with a require('jquery') it via Browserify.
var browserify = require('browserify-middleware');

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

// replace the jade view engine code...this was the default
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// use instead the handlebars view engine code...
app.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
//app.set('views', path.join(__dirname, "views"))

//app.engine('hbs', handlebars.engine);
//app.set('view engine', 'hbs');
//app.set('views', path.join(__dirname, "views"));

//CSS pre-processor setup
//Add the Sass middleware setup
app.use (
  sassMiddleware({
    src: __dirname + '/sass',
    dest: __dirname + '/public',
    debug: true,
  })
);

//Browserify setup
//Setup Browserify to load the script.js from the client directory in our project
//and create a bundle.js with all the dependencies resolved.
//NOTE: We need to make a small change to our directory structure to make this work.
//It will take just 2 commands in the terminal: the follwing 2 ones:
//mkdir client
//mv public/javascripts/script.js client/script.js
app.get('/javascripts/bundle.js', browserify('./client/script.js'));

//BrowerSync setup;
//this is for automatic browser refresh
//Setting up browser-sync to be loaded only when we are in the development environment,
//and then passing in a config object to initialize browser-sync.
//The config object sets up the files that we want browser-sync to watch for changes,
//it sets up the log level for the terminal (you can change it to logLevel: info if you dont want to see any messages),
//adds a delay for reload (as our server will restart on any file change) and causes a full-refresh of the browser on server restart.
//Now, when we make any changes to our code,
//our server will be restarted,
// and the browser will be refreshed to show the latest changes.
//This way we will no longer need to do this step manually.
if (app.get('env') == 'development') {
  var browserSync = require('browser-sync');
  var config = {
    files: ["public/**/*.{js,css}", "client/*.js", "sass/**/*.scss", "views/**/*.hbs"],
    logLevel: 'debug',
    logSnippet: false,
    reloadDelay: 3000,
    reloadOnRestart: true
  };
  var bs = browserSync(config);
  app.use(require('connect-browser-sync')(bs));
}


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

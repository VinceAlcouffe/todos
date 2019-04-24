var createError = require('http-errors');
var express = require('express');
//Add a require for express-handlebars to be able to use handlebars as the view engine code
var exphbs = require('express-handlebars');
//Add a require for mongoose
//Mongoose is an OBJECT DATA MANAGEMENT for Mongo
//and allows access to MongoDB in an object-oriented manner.
//Instead of writing queries in the Mongo query format
//we will use Mongoose to create an object schema for our collections,
//define relationships between the collections using ** in the schema,
//define validation conditions for schema properties and more.
var mongoose = require('mongoose');

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

//var todosRouters = require('./routes/todos')
//Refactor code so we can accomodate the routes for our todo api as well, using REST
//Our goal is to create
//the application routes in routes/todos/index.js, and
//the api routes in routes/todos/api.js.
// var todos = require('./routes/todos/index');
var todos = require('./routes/todos/index'); // added April 15 to move to REST
// need to Rename routes/todo.js to routes/todos/index.js
//Rename routes/todo.js to routes/todos/index.js
// cd routes
// mkdir todos
// mv todos.js todos/index.js

var todosAPI = require('./routes/todos/api'); // added April 15 to move to REST







// below is because you need a variable to hold our Express application.
// Express is not a default part of Node.

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

// app.use
// concept of middleware
//  Middleware functions allow you to take action on any incoming request,
// and modify it before sending back a response.

//CSS pre-processor setup
//Add the Sass middleware setup
app.use (
  sassMiddleware({
    src: __dirname + '/sass',
    dest: __dirname + '/public',
    debug: true,
  })
);


// now adding a Handlebars transform for Browserify in app.js, for Isomorphic Views
browserify.settings({
  transform: ['hbsfy']
});





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
if (app.get('env') === 'development') {
  var browserSync = require('browser-sync');
  var config = {
    files: ["public/**/*.{js,css}", "client/*.js", "sass/**/*.scss", "views/**/*.hbs"],
    logLevel: 'debug',
    logSnippet: false,
    reloadDelay: 300,
    reloadOnRestart: true
  };
  var bs = browserSync(config);
  app.use(require('connect-browser-sync')(bs));
}



//Connect to the MongoDB database,
//by passing the dbConnectionString to the todos collection.
//NOTE:
//We add an option to pass the Mongo database string as a process environment variable,
//so we can use it when deploying it on Heroku with MongoLab later in this code
//NOTE BIS: for mongoLab, then use MONGOLAB_URI, instead of MONGODB_URI
var dbConnectionString = process.env.MONGODB_URI || 'mongodb://localhost';
mongoose.connect(dbConnectionString + '/todos');







app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // for images, css , javascripts
// Serve Bootstrap fonts - thus add a route to our express server:
// The line added below will cause fonts needed by the Bootstrap framework to be served
// at the /fonts route which is needed for using icons from the Bootstrap framework.
app.use('/fonts', express.static(path.join(__dirname, 'node_modules/bootstrap-sass/assets/fonts')));

//use routes
// for example -
// only requests to /calendar/* will be sent to our "router"
// app.use('/calendar', router);

app.use('/', indexRouter); // only request to / will be send to indexRouter
app.use('/users', usersRouter);
//app.use('/todos', todos); //added Vincent
//app.use('/todos', todosRouters) /// removed April 15 to move to REST

app.use('/todos', todos); // added April 15 to move to REST
app.use('/api/todos', todosAPI); // added April 15 to move to REST


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

// +++++++++++++++  note on app.use() ++++++++++++++++
// app.use() used to Mounts the middleware function or,
// mount to a specified path,
// the middleware function is executed when the base path matches.

//For example: if you are using app.use() in indexRouter.js , like this:
//indexRouter.js
//var adsRouter = require('./adsRouter.js');
//module.exports = function(app) {
    //app.use('/ads', adsRouter);
//}
// In the above code app.use() mount the path on '/ads' to adsRouter.js.

//Now in adsRouter.js
// adsRouter.js
//var router = require('express').Router();
//var controllerIndex = require('../controller/index');
//router.post('/show', controllerIndex.ads.showAd);
//module.exports = router;

//in adsRouter.js, the path will be like this for ads- '/ads/show',
//and then it will work according to controllerIndex.ads.showAd().

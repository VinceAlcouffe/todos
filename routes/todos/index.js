// Routes specifie how an application responds to a client request,
// to a particular route, URI or path and a specific HTTP request method (GET, POST, etc.).
// It can handle different types of HTTP requests.


//create a router as a module
//load a middleware function
//define routes
//mount the router module on a path to the main app

var express = require('express');
var router = express.Router();
// remove the below line as we now move to MongoDB and Mongoose
//var todos = require('../models/todos');
// add instead the below line follwing the changes in the models/todos.js
//var Todo = require('../models/todos'); // modified April 15 to move to REST APIs, see just below

// Need to update a single line of the code for todos/index.js to fix the reference in the models directory.
var Todo = require('../../models/todos');



//When requesting the index route (”/todos”),
//the application tries to render the todos.hbs,
//which has to be present in a “views” folder


//remove the below lines as we now move to MongoDB and Mongoose
//router.get('/', function(req, res) {
  //res.render('todos', {title: 'Family Todos', todos: todos});
  //res.send('dont see my todos');//this works too
//});
//add instead the below following lines
//We wfirst require() the Todo model as defined above,
//and then within the router.get(),
//we call the .find() method on the model that returns
// all the documents in that collection in the callback function which
// we then pass to the the view to render.

//router.get('/', function(req, res) {
  //Todo.find(function(err, todos) {
    //if (err) return console.error(err);
    //res.render('todos', {title: 'Family Todos', todos: todos});
  //});
//});


// we goanna change the above code as we introdcued promises
// we now have new promise-aware methods on the mongoose library.
// Let's change the find() method with its promise-aware counterpart findAsync().
// Using findAsync(), we no longer have to pass the callback to the mongoose method,
// but instead append a .then() method,
// and pass the function to be called when the promise is resolved.
// We can add a a catch method that will be called when the promise is rejected,
// and a error method that will be called if there is a programmatic error.
// With these belwo changes, we have switched away from the callback-driven code,
//for our database operations,
// to a promise-oriented code.
router.get('/', function(req, res, next) {
  //Todo.findAsync()
  Todo.findAsync({}, null, {sort: {"_id":1}}) //changed April 18 while playing with AJAX
  .then(function(todos) {
    res.render('todos', {title: 'Todos', todos: todos});
  })
  .catch(next)
  .error(console.error);
});

//res.render(view [, locals] [, callback])

// Request and Response objects are the parameters of the callback function;
// which is used in Express applications.
// The request object (req) represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.
// The response object (res) specifies the HTTP response which is sent by an Express app when it gets an HTTP request.


//still keep the follwing line of course
module.exports = router;

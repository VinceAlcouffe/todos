var express = require('express');
var router = express.Router();

var Todo = require('../../models/todos');

//get all todos
router.route('/')
  .get(function(req, res, next) {
    // Todo.findAsync({})
    Todo.findAsync({}, null, {sort: {"_id":1}}) // Added April 18 while playing with AJAX
    .then(function(todos) {
      res.json(todos);
    })
    .catch(next)
    .error(console.error);
  });

// creata a todo
router.route('/')
  .post(function(req, res, next) {
    var todo = new Todo();
    todo.text = req.body.text;
    todo.saveAsync()
    .then(function(todo) {
      console.log("success");
      res.json({'status': 'success', 'todo': todo});
    })
    .catch(function(e) {
      console.log("fail");
      res.json({'status': 'error', 'error': e});
    })
    .error(console.error);
  });

// read a todo
// create an endpoint that gets back a single todo,
// when we pass the unique id of the todo in the url. e.g. http://localhost:3000/todos/<id>.
// IDs it is returned to us if we create a new Todo or show a list of Todos.
router.route('/:id')
  .get(function(req, res, next) {
    Todo.findOneAsync({_id: req.params.id}, {text: 1, done: 1})
    .then(function(todo) {
      res.json(todo);
    })
    .catch(next)
    .error(console.error);
  })
//chain a method to handle the GET,
//where we will use the findOneAsync() promisified method and pass
// the id in the query parameter of the method like {_id: req.params.id}.
//The projection parameter is the same as the one we had for getting all todos.

// update a todo
// create an API endpoint that will allow to update the text or done field of a single todo.
// In order to accept such requests, we will use the HTTP PUT request method, see below
router.route('/:id')
  .put(function(req, res, next) {
    var todo = {};
    var prop;
    for (prop in req.body) {
      todo[prop] = req.body[prop];
    }
    Todo.updateAsync({_id: req.params.id}, todo)
    .then(function(updatedTodo) {
      return res.json({'status': 'success', 'todo': updatedTodo});
    })
    .catch(function(e){
      return res.status(400).json({'status': 'fail', 'error': e});
    });
  })
// The first thing to do is to retrieve the new values of text & done (we can pass one or both),
// and add them to the todo object.
// Then we fire the updateAsync() method passing in the id and the todo object.
// Based on the new values passed in the request body, they will be updated in the database.


// delete a todo
// create an API endpoint through which we can delete a single todo;
// using the HTTP DELETE request method. see below code
router.route('/:id')
  .delete(function(req, res, next) {
    Todo.findByIdAndRemoveAsync(req.params.id)
    .then(function(deletedTodo) {
      res.json({'status': 'success', 'todo': deletedTodo});
    })
    .catch(function(e) {
      res.status(400).json({'status': 'fail', 'error': e});
    });
  });
//This code is similar to the endoint to get a single todo with 2 changes:
// first, the get method gets replaced with a delete method, and second,
// the Todo.findOneAsync in get() is replaced with Todo.findByIdAndRemoveAsync method,
// passing only the todo id in this case.

module.exports = router;

// For .get
// The overall code structure of this code is very similar to what
// we wrote for todos/index.js to render the todos list.
// There are a couple of changes here:
// the first, that we need to send back a JSON response and not render a Handlebars view.
// For this we use res.json() instead of res.render().
// The second is that we want to restrict the field in our JSON response.
// In the call to Todo.findAsync(param1, param2),
// the first parameter is for the query to fetch specific documents,
// the second parameter is for projection to only retrieve certain fields in the response.
// Our query parameter is {} which means we want all the records,
// and the projection parameter is {text: 1, done: 1} which means that
// we want only the text and done field.
// The _id field is always returned and cannot be disabled using the projection parameter.

// for .post
// create a new Todo object,
// add the text field passed in the body of the POST request,
// and call the saveAsync() promisified method on the todo object.
// On success, we send a json object back with the status of the request and the todo object itself.

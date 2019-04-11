//create a router as a module
//load a middleware function
//define routes
//mount the router module on a path to the main app

var express = require('express');
var router = express.Router();
var todos = require('../models/todos');


//When requesting the index route (”/todos”),
//the application tries to render the todos.hbs,
//which has to be present in a “views” folder
router.get('/', function(req, res) {
  res.render('todos', {title: 'Family Todos', todos: todos});
  //res.render('todos', {todos: todos});
  //res.send('dont see my todos');//this works too
});
module.exports = router;

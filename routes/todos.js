// first json model of the todo list and export it
//create a router as a module
//load a middleware function
//define routes
//mount the router module on a path to the main app

var express = require('express');
var router = express.Router();
var todos = require('../models/todos');

router.get('/', function(req, res) {
  //res.render('todos', {title: 'Todos', todos: todos});
  res.render('todos', {title: 'Todos', todos: todos});
});
module.exports = router;

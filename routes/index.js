// Routes specifie how an application responds to a client request,
// to a particular route, URI or path and a specific HTTP request method (GET, POST, etc.).
// It can handle different types of HTTP requests. 

//create a router as a module
//load a middleware function
//define routes
//mount the router module on a path to the main app

var express = require('express');
var router = express.Router();

/* GET home page. */
//When requesting the index route (”/”),
//the application tries to render the index.hbs,
//which has to be present in a “views” folder
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TODOS' }); // this works
  //res.render('index');
  //res.send('dont see my index')
});

module.exports = router;

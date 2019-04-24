// Routes specifie how an application responds to a client request,
// to a particular route, URI or path and a specific HTTP request method (GET, POST, etc.).
// It can handle different types of HTTP requests.

//create a router as a module
//load a middleware function
//define routes
//mount the router module on a path to the main app

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

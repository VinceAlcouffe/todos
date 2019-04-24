//FIRST basic model of the todos list as a json element representing
//the todo list, and export it

//var todos = [
  //'buy flight tickets',
  //'book a hotel room',
  //'pack your bags',
  //'another one for fun',
  //'yet another one',
  //"one more"
//];
//module.exports = todos;

//End of FIRST basic model

// SECOND model (now called a schema) of the todos list
// use now mongoDB and Mongoose
// Todos schema will consist of a todos text string,
// and a done boolean flag to mark whether the todo has been completed or not.
// For each property in the schema, we pass a type which stands for the datatype for the property,
// and any additional arguments like required: true etc,
// that provide validation for the type.
// Once the schema is defined, we call the mongoose.model() ,
// passing in the name of the model and the schema.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird'); //ADDED THIS LINE for promisify reasons
Promise.promisifyAll(mongoose); //ADDED THIS LINE for promisify reasons
var TodoSchema = new Schema({
  text: {type: 'String', required: true},
  done: {type: 'Boolean'}
 });
var Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;
//Now we have a Todo model that can be require()-d in any other part of the application.
// AND we ALSO need to change routes/todos.js accordinally, to retrieve from the database.


// THIRD model
// Let's refactor our existing code that connects to the database and fetches todos using callbacks,
// to use promises instead.
// The Bluebird package (npm install --save bluebird)
// makes it really east to convert existing promise-unaware libraries,
// to promise-aware libraries by using the promisifyAll() method.
// We need to require the promise library in the model file,
// and then run promisifyAll() method by passing the mongoose object.
// This will create promise returning methods on all our mongoose models,
// which end with Async e.g.
// we will get a method findAsync() to use instead of find(), saveAsync() vs save() and so on.
// TO DO SO, we have added the folloing two lines of code above
//// var Promise = require('bluebird'); //ADD THIS LINE
//// Promise.promisifyAll(mongoose); //AND THIS LINE

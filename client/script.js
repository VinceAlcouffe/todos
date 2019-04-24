
// FIRST TRIAL
//Adding interactions
//Public/javascript folder for interactions
//Adding a basic alert - see below
//The alert is only popping up into /home and /todos, not /users
//But if we were to restart and refresh, notice that the alert message is not displayed.
//Because we have not hooked up our HTML to load the JavaScript on page load.
//to "fix" this::
//Open views/layout.jade and edit it to add the below script tag at the bottom of the body.
//script(src='/javascripts/script.js')

// removing , was for above practicing

//alert('Hello Todos!')


// SECOND TRIAL
//add JavaScript that will run every time a user clicks on a checkbox
//checboxes here refer to the views/todos.hbs checkboxes
//see :: input(type='checkbox') in todos.jade views
//See <input type="checkbox"> in todos.hbs views
//how the below works:
//assign a function to be run when the DOM is ready.
//this function selects all the checkboxes using tag name 'input',
//iterates over them,
//and assigns a clickHandler function to be run every time a checkbox is clicked.
//The clickHandler function will:
//add or remove the 'checked' css class from the span tag (next element sibling),
//based on whether the checkbox is selected or de-selected.
//see the span into todos.jade view
//parent node is val? I dont know
//NOT HERE (but instead into styles.css)
//Finally, let's edit style.css to
//add a new selector at the bottom of the existing styles,
//that will decorate the span element of a checked list element:

//*** code for 2nd trial

//document.addEventListener("DOMContentLoaded", function(event) {
  //var checkboxes = document.getElementsByTagName('input');
  //for (var i = 0; i < checkboxes.length; i++) {
    //checkboxes[i].addEventListener('click', clickHandler);
  //}
//});

//function clickHandler() {
  //if(this.checked) {
    //this.parentNode.className = 'checked';
  //} else {
    //this.parentNode.className = '';
  //}
//}

//*** end of code for 2nd trial

// THIRD TRIAL
// replacing above second trial code
// by below jQuery equivalent code
// note jQuery has been added into views/layouts/layout.hbs

//// Third Trial Bis
//// Require jQuery
/// In order to use jQuery, need to first install it as a dependency.
/// in a terminal : npm install jquery --save
//// then require JQuery to our script.js by adding this line to the top of script.js:
var $ = require('jquery');

// Require the template in client/script.js , For Isomorphic Views
var todoTemplate = require("../views/partials/todo.hbs");

//The jQuery syntax is tailor-made for selecting HTML elements and performing
// some action on the element(s).
//Basic syntax is: $(selector).action()
//$ sign to define/access jQuery
//(selector) to "query (or find)" HTML elements
//jQuery action() to be performed on the element(s)
//Examples:
//$(this).hide() - hides the current element.
//$("p").hide() - hides all <p> elements.
//$(".test").hide() - hides all elements with class="test".
//$("#test").hide() - hides the element with id="test".

// below is intial 3rd trial
// above is because we now use Browserify to bundle all scripts

// jQuery document ready event handler
// $(function() {
//  $(":button").on('click', addTodo); // for AJAX dev , added April,18
//  $(":text").on('keypress',function(e) { // for AJAX dev , added April,18
//    var key = e.keyCode; // for AJAX dev , added April,18
//    if( key == 13 || key == 169) { // for AJAX dev , added April,18
//      addTodo(); // for AJAX dev , added April,18
//      e.stopPropagation();// for AJAX dev , added April,18
//      return false; // for AJAX dev , added April,18
//    }
//  });
//  $('input').on('click', function() {
//    $(this).parent().toggleClass('checked');
//  });
//});

// CREATE A TODO
$(function() {
  $(":button").on('click', addTodo);
  // e below in an event object
  $(":text").on('keypress',function(e) {
    var key = e.keyCode;
    if( key == 13 || key == 169) {
      addTodo();
      e.preventDefault();
      e.stopPropagation();
      return false; // returning false will prevent the event from bubbling up.
    }
  });

// UPDATE A TODO
  //$('input').on('click', function() {
    //$(this).parent().toggleClass('checked');
  //});
  // replaced above 3 lines by below 10 lines
  // We pass 3 arguments to the updateTodo function:
  // todo id, updated todo data & a callback function.
  // This callback function will update the styles on the todo (and is similar to the code we removed)
$('ul').on('change', 'li :checkbox', function() {
  var $this = $(this), // variable $this is a jQuery object. $(this) is the object reference so here 'ul'
  $input = $this[0],
  $li = $this.parent(), // Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
  id = $li.attr('id'),
  checked = $input.checked, //checked is a boolean
  data = { done: checked };
  updateTodo(id, data, function(d) {
    $this.next().toggleClass('checked'); //This callback function will update the styles on the todo
  });
});


// UPDATE A TODO TEXT
$('ul').on('keydown', 'li span', function(e) {
  var $this = $(this),
  $span = $this[0],
  $li = $this.parent(),
  id = $li.attr('id'),
  key = e.keyCode,
  target = e.target,
  text = $span.innerHTML,
  data = { text: text};
  $this.addClass('editing');
  if(key === 27) { //escape key
    $this.removeClass('editing');
    document.execCommand('undo');
    target.blur();
  } else if(key === 13) { //enter key
    updateTodo(id, data, function(d) {
      $this.removeClass('editing');
      target.blur();
    });
    e.preventDefault();
  }
});

// DELETE A TODO
$('ul').on('click', 'li a', function() {
  var $this = $(this),
  $input = $this[0],
  $li = $this.parent(),
  id = $li.attr('id');
  deleteTodo(id, function(e){
    deleteTodoLi($li);
  });
});

// Add event handlers for the filter links to add/remove the hide class
$('.filter').on('click', '.show-all', function() {
  $('.hide').removeClass('hide');
});
$('.filter').on('click', '.show-not-done', function() {
  $('.hide').removeClass('hide');
  $('.checked').closest('li').addClass('hide');
});
$('.filter').on('click', '.show-done', function() {
  $('li').addClass('hide');
  $('.checked').closest('li').removeClass('hide');
});
$(".clear").on("click", function() {
  var $doneLi = $(".checked").closest("li");
  for (var i = 0; i < $doneLi.length; i++) {
    var $li = $($doneLi[i]); //you get a li out, and still need to convert into $li
    var id = $li.attr('id');
    (function($li){
      deleteTodo(id, function(){
        deleteTodoLi($li);
      });
    })($li);
  }
});

});

// keep a live count of todos,
// detect any insertion or deletions of todos in the list and,
// update the count on any change.
// Such functionality is provided by a Mutation Observer and,
//Add an observer in script.js to watch our Todos for changes
var initTodoObserver = function () {
  var target = $('ul')[0];
  var config = { attributes: true, childList: true, characterData: true };
  var observer = new MutationObserver(function(mutationRecords) {
    $.each(mutationRecords, function(index, mutationRecord) {
      updateTodoCount();
    });
  });
  if(target) {
    observer.observe(target, config);
  }
  updateTodoCount();
};

// add an update count function
var updateTodoCount = function () {
  $(".count").text($("li").length);
};


// here is how above jQuery code works::
// 1- The $ (function() {...}); in the first line is a replacement of the DOMContentLoaded event,
// with jQuery's support for document.ready().
// 2- The $('input') is the way to use selectors to get a reference
// to all the input elements on our page.
// 3- Instead of iterating over each of them,
// and attaching a callback handler method one at a time,
// jQuery gives us the .on() API,
// to attach a callback handler to each element that matches the selector.
// 4- We could have kept our entire callback handler as a separate function,
// but moving it as an inline function helps keep the code shorter and easier,
// to understand in this case
// 5- In the previous implementation, we were reading the
// 'checked' value of the input element and then,
// applying the appropriate class.
// jQuery makes it simpler with a .toggleClass() function,
// that will simply add the class if it's not present or remove if it is.


// for AJAX dev , added April,18
// We now add the event handler method, addTodo,
// to get the value of the text in the form,
// and make an AJAX request to the /api/todos endpoint using POST.
var addTodo = function() {
  var text = $('#add-todo-text').val();
  $.ajax({
    url: '/api/todos',
    type: 'POST',
    data: {
      text: text
    },
    dataType: 'json',
    success: function(data) { // return data ie the data text in json format and update api/todos thus update the mongoDB
      var todo = data.todo[0]; // moving to Isomorphic Views , April 18
      var newLiHtml = todoTemplate(todo); // moving to Isomorphic Views , April 18
      $('form + ul').append(newLiHtml);
      $('#add-todo-text').val('');
    }
  });
};



// add the updateTodo function, where we will make the AJAX call
var updateTodo = function(id, data, cb) {
  $.ajax({
    url: '/api/todos/'+id,
    type: 'PUT',
    data: data,
    dataType: 'json',
    success: function(data) {
      cb();
    }
  });
};

var deleteTodo = function(id, cb) {
  $.ajax({
    url: '/api/todos/'+id,
    type: 'DELETE',
    data: {
      id: id
    },
    dataType: 'json',
    success: function(data) {
      cb();
    }
  });
};

var deleteTodoLi = function($li) {
  $li.remove();
};

initTodoObserver();

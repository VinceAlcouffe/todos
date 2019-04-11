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
//NOT HERE (but insteas into styles.css)
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

//// Tird Trial Bis
//// Require jQuery
/// In order to use jQuery, need to first install it as a dependency.
/// in a term : npm install jquery --save
//// then require JQuery to our script.js by adding this line to the top of script.js:
var $ = require('jquery');
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
$(function() {
  $('input').on('click', function() {
    $(this).parent().toggleClass('checked');
  });
});

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

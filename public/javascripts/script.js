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
//checboxes here refer to the todos.jade checkboxes
//see :: input(type='checkbox') in todos.jade views
//how the below works:
//assign a function to be run when the DOM is ready.
//this function selects all the checkboxes using tag name 'input',
//iterates over them,
// and assigns a clickHandler function to be run every time a checkbox is clicked.
//The clickHandler function will:
//add or remove the 'checked' css class from the span tag (next element sibling),
//based on whether the checkbox is selected or de-selected.
//see the span into todos.jade view
//parent node is val? I dont know
//NOT HERE (but insteas into styles.css)
//Finally, let's edit style.css to
//add a new selector at the bottom of the existing styles,
//that will decorate the span element of a checked list element:


document.addEventListener("DOMContentLoaded", function(event) {
  var checkboxes = document.getElementsByTagName('input');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('click', clickHandler);
  }
});

function clickHandler() {
  if(this.checked) {
    this.parentNode.className = 'checked';
  } else {
    this.parentNode.className = '';
  }
}

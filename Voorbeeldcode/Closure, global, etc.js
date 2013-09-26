	Local vs Global code:

var name = "Richard";

function showName () {
	var name = "Jack"; // local variable; only accessible in this showName function
	console.log (name); // Jack
}
console.log (name); // Richard: the global variable



	Closure:

function showName (firstName, lastName) { 
var nameIntro = "Your name is ";
    // this inner function has access to the outer function's variables, including the parameter
function makeFullName () {         
return nameIntro + firstName + " " + lastName;     
}

return makeFullName (); 
} 

showName ("Michael", "Jackson"); // Your name is Michael Jackson 



	self-executing(invoking) anonymous function:

(function(){
  //Normal code goes here
})();

	Nogmaals:

	(function(){
  var foo = 'Hello';
  var bar = 'World!'
  
  function baz(){
      return foo + ' ' + bar;
  }

  window.baz = baz; //Assign 'baz' to the global variable 'baz'...
})();

console.log(baz()); //...and now this works.

//It's important to note that these still won't work: 
console.log(foo);
console.log(bar);



	this

var person = {
    firstName   :"Penelope",
    lastName    :"Barrymore",
    // Since the "this" keyword is used inside the showFullName method below, and the showFullName method is defined on the person object,
    // "this" will have the value of the person object because the person object will invoke showFullName ()
    showFullName:function () {
    console.log (this.firstName + " " + this.lastName);
    }

    }

    person.showFullName (); // Penelope Barrymore
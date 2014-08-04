	
	var obj = {
		firstName:"John", 
		lastName:"Dow",
		getFullName:function() {
			return this.firstName+" "+this.lastName;
		},
		greetLambda:function(param) {
			var displayMessage = (function(msg1){  
				return function(msg2){  
					return msg1 + msg2;
			   }     
			}(param));
			return displayMessage("Lambda World!");
		}
	},
    strfn  = require('../jsonfn').JSONfn.stringify(obj),
	objfn = require('../jsonfn').JSONfn.parse(strfn);
	

console.log('\n==============================================================================\n');

console.log('\n/*------- stringified obgect: -------*/\n\n' + strfn + '\n');

console.log('\n/*------- First Name: -------*/\n\n' + objfn.firstName + '\n');
console.log('\n/*------- Full name: -------------*/\n\n' + objfn.getFullName()  + '\n');
console.log('\n/*------- Lambda Greeting: -------*/\n\n' + objfn.greetLambda('Hello ') + '\n');
console.log('\n===============================================================================\n');










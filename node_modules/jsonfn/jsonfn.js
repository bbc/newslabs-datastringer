/**
* JSONfn - javascript plugin to convert javascript objects, ( including ones with functions ) 
* to string and vise versa.
*  
* Version - 0.31.0
* Copyright (c) 2012 Vadim Kiryukhin
* vkiryukhin @ gmail.com
* http://www.eslinstructor.net/jsonfn/
* 
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*   USAGE:
* 
*   require('jsonfn').JSONfn.stringify(obj);
*	require('jsonfn').JSONfn.parse(str);
*
*        @obj   -  javascript object;
*		 @strfn -  String in JSON format; 
*
*   Examples:
*		
*   var strfn = require('jsonfn').JSONfn.stringify(obj);
*	var objfn = require('jsonfn').JSONfn.parse(strfn);
*
*/

// Create a JSON object only if it does not already exist. 
var JSONfn;
if (!JSONfn) {
    JSONfn = {};
}

(function () {
	
	JSONfn.stringify = function(obj) {
		return JSON.stringify(obj,function(key, value){
				return (typeof value === 'function' ) ? value.toString() : value;
			});
	}

	JSONfn.parse = function(str) {
		return JSON.parse(str,function(key, value){
			if(typeof value != 'string') return value;
			return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
		});
	}
}());

exports.JSONfn = JSONfn;	

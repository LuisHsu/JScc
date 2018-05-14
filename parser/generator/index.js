//    Copyright 2018 Luis Hsu
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

const fs = require('fs');
const rule = require('./rule');
// Get terminals and expand opt element
var nonTerms = Object.keys(rule);
var terms = {};
nonTerms.forEach((nonTerm) => {
	for(var i = 0; i < rule[nonTerm].length; ++i){
		var subrule = rule[nonTerm][i];
		subrule.forEach((elemStr, index) => {
			var elem = elemStr.replace("\t", "");
			if(elemStr.endsWith('\t')){
				var newSub = subrule.slice();
				newSub.splice(index, 1);
				rule[nonTerm].push(newSub);
				subrule[index] = elem;
			}
			// Terminal
			if(!rule[elem]){
				terms[elem] = [];
			}
		});
	}
});

// First set
var firstSet = JSON.parse(JSON.stringify(terms));
Object.keys(firstSet).forEach((key) => {
	firstSet[key].push(key);
});
for(var modified = true; modified; ){
	modified = false;
	Object.keys(rule).forEach((nonterm) => {
	});
}

fs.writeFile('out.txt', JSON.stringify(firstSet, null, '\t'), () => {});
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
// Get start
var ruleStart = rule.start;
delete rule.start;
// Get terminals and expand opt element
var terms = {
	EOF:[]
};
Object.keys(rule).forEach((nonTerm) => {
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
		rule[nonterm].forEach((subrule) => {
			if(firstSet[subrule[0]]){
				firstSet[subrule[0]].forEach((elem) => {
					if(!firstSet[nonterm]){
						firstSet[nonterm] = [elem];
						modified = true;
					}else if(!firstSet[nonterm].find((first) => {
						return first == elem;
					})){
						firstSet[nonterm].push(elem);
						modified = true;
					}
				});
			}
		});
	});
}

// LR(1) Autometa
var states = [closure({
	items: [{
		nonterm: 'start',
		elements: [ruleStart],
		index: 0,
		lookahead: {
			EOF: "EOF"
		}
	}],
	gotos: {}
})];
function itemCompare(a, b){
	if(a.nonterm != b.nonterm || a.index != b.index){
		return false;
	}
	if(a.elements.length != b.elements.length || a.lookahead.length != b.lookahead.length){
		return false;
	}
	for(var i = 0; i < a.elements.length; ++i){
		if(a.elements[i] != b.elements[i]){
			return false;
		}
	}
	return true;
}
function closure(itemSet){
	for(var modified = true; modified; ){
		modified = false;
		for(var itemIndex = 0; itemIndex < itemSet.items.length; ++itemIndex){
			var item = itemSet.items[itemIndex];
			var key = item.elements[item.index];
			if(item.index < item.elements.length && rule[key]){
				var production = rule[key];
				var lookahead = {};
				if(item.index + 1 < item.elements.length){
					firstSet[item.elements[item.index + 1]].forEach((first) => {
						lookahead[first] = first;
					});
				}else{
					lookahead = item.lookahead;
				}
				production.forEach((subrule) => {
					var newItem = {
						nonterm: key,
						elements: subrule,
						index: 0,
						lookahead: lookahead
					};
					var findItem = itemSet.items.find((f) => {
						return itemCompare(f, newItem);
					});
					if(!findItem){
						itemSet.items.push(newItem);
						modified = true;
					}else{
						var findKeys = Object.keys(findItem.lookahead);
						var assigned = Object.assign(findItem.lookahead, newItem.lookahead);
						if(findKeys.length != Object.keys(assigned).length){
							findItem.lookahead = assigned;
							modified = true;
						}
					}
				});
			}
		}
	}
	return itemSet;
}
function goto(itemSet, symbol){
	var newSet = {
		items: [],
		gotos: {}
	};
	itemSet.items.forEach((item) => {
		if(item.index < item.elements.length && item.elements[item.index] == symbol){
			var newItem = Object.assign({}, item);
			newItem.index += 1;
			newSet.items.push(newItem);
		}
	});
	if(newSet.items.length == 0){
		return null;
	}else{
		return closure(newSet);
	}
}
for(var modified = true; modified; ){
	modified = false;
	for(var stateIndex = 0; stateIndex < states.length; ++stateIndex){
		var state = states[stateIndex];
		state.items.forEach((item) => {
			if(item.index < item.elements.length){
				var symbol = item.elements[item.index];
				var gotoState = goto(state, symbol);
				var gotoIndex = states.findIndex((findState) => {
					if(findState.items.length != gotoState.items.length){
						return false;
					}
					for(var i = 0; i < findState.items.length; ++i){
						if(!itemCompare(findState.items[i], gotoState.items[i])){
							return false;
						}else{
							var assigned = Object.assign(findState.items[i].lookahead, gotoState.items[i].lookahead);
							if(Object.keys(findState.items[i].lookahead).length != Object.keys(assigned).length){
								return false;
							}
						}
					}
					return true;
				});
				if(gotoState != null){
					if(gotoIndex == -1){
						states.push(gotoState);
						state.gotos[symbol] = states.length - 1;
						modified = true;
					}else{
						state.gotos[symbol] = gotoIndex;
					}
				}
			}
		});
	}
}
fs.writeFile('out.txt', JSON.stringify(states, null, '\t'), () => {});
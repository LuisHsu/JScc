const rule = require('./rule');

// Expand rule
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
		});
	}
});

// Rule map
var ruleMap = {};
Object.keys(rule).forEach((nonTerm) => {
	rule[nonTerm].forEach((subrule) => {
		subrule.forEach((element, index) => {
			if(!ruleMap[element]){
				ruleMap[element] = [];
			}
			ruleMap[element].push({
				subrule: subrule,
				index: index
			});
		});
	});
});

class Parse {
	constructor(){
		this.layers = [];
	}
	run(tokens){
		this.layers.push(this.tokenLayer(tokens));
		return this.layers;
	}
	tokenLayer(tokens){
		var newLayer = [];
		tokens.forEach((token) => {
			var newState = [];
			ruleMap[getTokenKey(token)].forEach((rule) => {
				var newNode = {
					rule: rule,
					slots: Array(rule.length)
				};
				newNode.slots[rule.index] = token;
				newState.push(newNode);
			});
			newLayer.push(newState);
		});
		return newLayer;
	}
}

function getTokenKey(token){
	if(token.type == "keyword" || token.type == "punctuator"){
		return token.value;
	}else{
		return token.type;
	}
}

module.exports = () => {
	return new Parse();
};
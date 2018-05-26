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
				nonterm: nonTerm,
				subrule: subrule,
				index: index
			});
		});
	});
});

class Parse {
	constructor(tokens){
		this.layer = [];
		this.tokens = tokens;
	}
	run(){
		this.tokenLayer();
		while(this.hasUnsolved()){
			this.mergeNode();
			this.elevate();
		}
		return this.layer;
	}
	tokenLayer(){
		this.tokens.forEach((token) => {
			var newGroup = [];
			ruleMap[getTokenKey(token)].forEach((rule) => {
				var newNode = {
					rule: rule,
					slots: Array(rule.subrule.length).fill(null)
				};
				newNode.slots[rule.index] = token;
				newGroup.push(newNode);
			});
			this.layer.push(newGroup);
		});
	}
	elevate(){
		this.layer.forEach(((group, groupIndex) => {
			var elevateNodes = [];
			this.layer[groupIndex] = group.filter((node) => {
				if(node.rule.nonterm != "start" && !node.slots.some((slot) => {
					return slot == null;
				})){
					elevateNodes.push(node);
					return false;
				}else{
					return true;
				}
			});
			elevateNodes.forEach(((node) => {
				ruleMap[node.rule.nonterm].forEach(((rule) => {
					var newNode = {
						rule: rule,
						slots: Array(rule.subrule.length).fill(null)
					};
					newNode.slots[rule.index] = node;
					this.layer[groupIndex].push(newNode);
				}).bind(this));
			}).bind(this));
		}).bind(this));
	}
	mergeNode(){
		this.layer.forEach(((group, groupIndex) => {
			group.forEach(((node) => {
				for(var slotIndex = 0; slotIndex < node.slots.length; ++slotIndex){
					if(node.slots[slotIndex] == null){
						var targetIndex = groupIndex + (slotIndex - node.rule.index);
						if(targetIndex >= 0 && targetIndex < this.layer.length){
							this.layer[targetIndex].forEach((targetNode) => {
								if(compareRule(targetNode.rule,node.rule)){
									node.slots[slotIndex] = targetNode;
								}
							});
						}
					}
				}
			}).bind(this));
		}).bind(this));
	}
	hasUnsolved(){
		var noStart = true;
		var allNodeHasNull = this.layer.some((group) => {
			if(noStart){
				return group.some((node) => {
					if(node.rule.nonterm == "start"){
						noStart = false;
						return false;
					}
					return !node.slots.some((slot) => {
						return slot == null;
					});
				});
			}else{
				return false;
			}
		});
		return noStart && allNodeHasNull;
	}
}

function compareRule(a, b){
	if(a.nonterm == b.nonterm){
		if(a.subrule.length == b.subrule.length){
			for(var i = 0; i < a.subrule.length; ++i){
				if(a.subrule[i] != b.subrule[i]){
					return false;
				}
			}
			return true;
		}
	}
	return false;
}

function getTokenKey(token){
	if(token.type == "keyword" || token.type == "punctuator"){
		return token.value;
	}else{
		return token.type;
	}
}

module.exports = (tokens) => {
	return new Parse(tokens);
};
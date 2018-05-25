function type_specifier_3(context){
	context.stack.pop();
	context.states.shift();
	return {
		type: "type_specifier",
		value: "int"
	};
}

function declaration_specifiers_6(context){
	var type = context.stack.pop();
	context.states.shift();
	return {
		type: "declaration_specifiers",
		type_specifier: type.value
	};
}

module.exports = {
	type_specifier_3: type_specifier_3,
	declaration_specifiers_6: declaration_specifiers_6
};
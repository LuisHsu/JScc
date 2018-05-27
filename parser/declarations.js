const {getToken} = require('./utils');

function declaration(context, tokens){
	var exprs = [declaration_specifiers(context, tokens),
		init_declarator_list(context, tokens),
		getToken(";", tokens)
	];
	if(exprs[0] != null && exprs[2] != null){
		// TODO:
	}
	exprs = [static_assert_declaration(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function storage_class_specifier(context, tokens){

}

function static_assert_declaration(context, tokens){

}

function type_specifier(context, tokens){

}

function type_qualifier(context, tokens){

}

function function_specifier(context, tokens){

}

function alignment_specifier(context, tokens){

}

function declaration_specifiers(context, tokens){
	var exprs = [storage_class_specifier(context, tokens), declaration_specifiers(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [type_specifier(context, tokens), declaration_specifiers(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [type_qualifier(context, tokens), declaration_specifiers(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [function_specifier(context, tokens), declaration_specifiers(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [alignment_specifier(context, tokens), declaration_specifiers(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function declarator(context, tokens){

}

function init_declarator(context, tokens){

}

function init_declarator_list(context, tokens){
	var exprs = [init_declarator(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [init_declarator_list(context, tokens), getToken(",", tokens), init_declarator(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

module.exports = {
	declaration: declaration,
	declaration_specifiers: declaration_specifiers,
	declarator: declarator,
	init_declarator_list: init_declarator_list,
	static_assert_declaration: static_assert_declaration,
	storage_class_specifier: storage_class_specifier,
	type_specifier: type_specifier,
	type_qualifier: type_qualifier,
	function_specifier: function_specifier,
	alignment_specifier: alignment_specifier,
	init_declarator: init_declarator
};
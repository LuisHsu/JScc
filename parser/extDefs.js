const decl = require('./declarations');
const stmt = require('./statements');

function translation_unit(context, tokens){
	var exprs = [external_declaration(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [translation_unit(context, tokens), external_declaration(context, tokens)];
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	return null;
}

function external_declaration(context, tokens){
	var exprs = [function_definition(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [decl.declaration(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function function_definition(context, tokens){
	var exprs = [decl.declaration_specifiers(context, tokens),
		decl.declarator(context, tokens),
		declaration_list(context, tokens),
		stmt.compound_statement(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[3] != null){
		// TODO:
	}
	return null;
}

function declaration_list(context, tokens){
	var exprs = [function_definition(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [decl.declaration(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

module.exports = {
	translation_unit: translation_unit,
	external_declaration: external_declaration,
	function_definition: function_definition,
	declaration_list: declaration_list
};
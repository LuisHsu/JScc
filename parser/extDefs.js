const decl = require('./declarations');
const stmt = require('./statements');

/* declaration{
	type: "translation_unit"
	external_declarations: Array of function_definition or declaration
} */
function translation_unit(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [external_declaration(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? translation_unit(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		exprs[1].external_declarations.unshift(exprs[0]);
		return exprs[1];
	}else if(exprs[0] != null){
		return {
			type: "translation_unit",
			external_declarations: [exprs[0]]
		};
	}
	return null;
}

function external_declaration(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [function_definition(context, tokens)];
	if(exprs[0] != null){
		return exprs[0];
	}
	tokens.cursor = cursor;
	exprs = [decl.declaration(context, tokens)];
	if(exprs[0] != null){
		return exprs[0];
	}
	return null;
}

function function_definition(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [decl.declaration_specifiers(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? decl.declarator(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? declaration_list(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? stmt.compound_statement(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[3] != null){
		// TODO:
	}
	return null;
}

function declaration_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [function_definition(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
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
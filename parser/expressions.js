const {getToken} = require('./utils');

module.exports = {
	constant_expression: constant_expression,
	assignment_expression: assignment_expression,
	primary_expression: primary_expression
};

function primary_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [declaration_specifiers(context, tokens),
		init_declarator_list(context, tokens),
		getToken(";", tokens)
	];
	if(exprs[0] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [static_assert_declaration(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function assignment_expression(context, tokens){

}

function constant_expression(context, tokens){

}
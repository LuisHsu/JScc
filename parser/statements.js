const {getToken} = require('./utils');
const declarations = require('./declarations');
const expressions = require('./expressions');

module.exports = {
	statement: statement,
	labeled_statement: labeled_statement,
	compound_statement: compound_statement,
	block_item_list: block_item_list,
	block_item: block_item,
	expression_statement: expression_statement,
	selection_statement: selection_statement,
	iteration_statement: iteration_statement,
	jump_statement: jump_statement
};

function statement(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [labeled_statement(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [compound_statement(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [expression_statement(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [selection_statement(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [iteration_statement(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [jump_statement(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function labeled_statement(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("identifier", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken(":", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? statement(context, tokens) : null);
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [compound_statement(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [expression_statement(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [selection_statement(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [iteration_statement(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [jump_statement(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function compound_statement(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("{", tokens)];
	exprs.push(exprs[exprs.length - 1] ? block_item_list(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken("}", tokens) : null);
	if(exprs[0] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function block_item_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [block_item(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [block_item_list(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? block_item(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	return null;
}

function block_item(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [declarations.declaration(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [statement(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function expression_statement(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [expressions.expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken(";", tokens) : null);
	if(exprs[1] != null){
		// TODO:
	}
	return null;
}

function selection_statement(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("if", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? expressions.expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? statement(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken("else", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? statement(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null && exprs[5] != null && exprs[6] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("if", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? expressions.expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? statement(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4]){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("switch", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? expressions.expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? statement(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4]){
		// TODO:
	}
	return null;
}

function iteration_statement(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("while", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? expressions.expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? statement(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("do", tokens)];
	exprs.push(exprs[exprs.length - 1] ? statement(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken("while", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? expressions.expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(";", tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null && exprs[5] != null && exprs[6] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("for", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? expressions.expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(";", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? expressions.expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(";", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? expressions.expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? statement(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[3] != null && exprs[5] != null && exprs[7] != null && exprs[8] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("for", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? declarations.declaration(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? expressions.expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(";", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? expressions.expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? statement(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[4] != null && exprs[6] != null && exprs[7] != null){
		// TODO:
	}
	return null;
}

function jump_statement(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("goto", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("identifier", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(";", tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2]){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("continue", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken(";", tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("break", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken(";", tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("return", tokens)];
	exprs.push(exprs[exprs.length - 1] ? expressions.expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(";", tokens) : null);
	if(exprs[0] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}
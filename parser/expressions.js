const {getToken} = require('./utils');
const declarations = require('./declarations');

module.exports = {
	constant_expression: constant_expression,
	assignment_expression: assignment_expression,
	primary_expression: primary_expression,
	expression: expression,
	generic_selection: generic_selection,
	generic_assoc_list: generic_assoc_list,
	generic_association: generic_association,
	postfix_expression: postfix_expression,
	argument_expression_list: argument_expression_list,
	unary_expression: unary_expression,
	unary_operator: unary_operator,
	cast_expression: cast_expression,
	multiplicative_expression: multiplicative_expression,
	additive_expression: additive_expression,
	shift_expression: shift_expression,
	relational_expression: relational_expression,
	equality_expression: equality_expression,
	AND_expression: AND_expression,
	exclusive_OR_expression: exclusive_OR_expression,
	inclusive_OR_expression: inclusive_OR_expression,
	logical_AND_expression: logical_AND_expression,
	logical_OR_expression: logical_OR_expression,
	conditional_expression: conditional_expression,
	assignment_operator: assignment_operator
};

function primary_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("identifier", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("floating", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("character", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("integer", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("string", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("(", tokens),
		expression(context, tokens),
		getToken(")", tokens)
	];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [generic_selection(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function generic_selection(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("_Generic", tokens),
		getToken("(", tokens),
		assignment_expression(context, tokens),
		getToken(",", tokens),
		generic_assoc_list(context, tokens),
		getToken(")", tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null && exprs[5] != null){
		// TODO:
	}
	return null;
}

function generic_assoc_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [generic_association(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [generic_assoc_list(context, tokens),
		getToken(",", tokens),
		generic_association(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function generic_association(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [declarations.type_name(context, tokens),
		getToken(":", tokens),
		assignment_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("default", tokens),
		getToken(":", tokens),
		assignment_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function postfix_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [primary_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [postfix_expression(context, tokens),
		getToken("[", tokens),
		expression(context, tokens),
		getToken("]", tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [postfix_expression(context, tokens),
		getToken("(", tokens),
		argument_expression_list(context, tokens),
		getToken(")", tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[3] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [postfix_expression(context, tokens),
		getToken(".", tokens),
		getToken("identifier", tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [postfix_expression(context, tokens),
		getToken("->", tokens),
		getToken("identifier", tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [postfix_expression(context, tokens),
		getToken("++", tokens)
	];
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [postfix_expression(context, tokens),
		getToken("--", tokens)
	];
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("(", tokens),
		declarations.type_name(context, tokens),
		getToken(")", tokens),
		getToken("{", tokens),
		declarations.initializer_list(context, tokens),
		getToken("}", tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null && exprs[5] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("(", tokens),
		declarations.type_name(context, tokens),
		getToken(")", tokens),
		getToken("{", tokens),
		declarations.initializer_list(context, tokens),
		getToken(",", tokens),
		getToken("}", tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null && exprs[5] != null && exprs[6] != null){
		// TODO:
	}
	return null;
}

function argument_expression_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [assignment_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [argument_expression_list(context, tokens),
		getToken(",", tokens),
		assignment_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function unary_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [postfix_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("++", tokens),
		unary_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("--", tokens),
		unary_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [unary_operator(context, tokens),
		cast_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("sizeof", tokens),
		unary_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("sizeof", tokens),
		getToken("(", tokens),
		declarations.type_name(context, tokens),
		getToken(")", tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("_Alignof", tokens),
		getToken("(", tokens),
		declarations.type_name(context, tokens),
		getToken(")", tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null){
		// TODO:
	}
	return null;
}

function unary_operator(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("&", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("*", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("+", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("-", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("~", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("!", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function cast_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [unary_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("(", tokens),
		declarations.type_name(context, tokens),
		getToken(")", tokens),
		cast_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null){
		// TODO:
	}
	return null;
}

function multiplicative_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [cast_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [multiplicative_expression(context, tokens),
		getToken("*", tokens),
		cast_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [multiplicative_expression(context, tokens),
		getToken("/", tokens),
		cast_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [multiplicative_expression(context, tokens),
		getToken("%", tokens),
		cast_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function multiplicative_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [cast_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [multiplicative_expression(context, tokens),
		getToken("*", tokens),
		cast_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [multiplicative_expression(context, tokens),
		getToken("/", tokens),
		cast_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [multiplicative_expression(context, tokens),
		getToken("%", tokens),
		cast_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function additive_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [multiplicative_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [additive_expression(context, tokens),
		getToken("+", tokens),
		multiplicative_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [additive_expression(context, tokens),
		getToken("-", tokens),
		multiplicative_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function shift_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [additive_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [shift_expression(context, tokens),
		getToken("<<", tokens),
		additive_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [shift_expression(context, tokens),
		getToken(">>", tokens),
		additive_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function relational_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [shift_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [relational_expression(context, tokens),
		getToken("<", tokens),
		shift_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [relational_expression(context, tokens),
		getToken(">", tokens),
		shift_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [relational_expression(context, tokens),
		getToken("<=", tokens),
		shift_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [relational_expression(context, tokens),
		getToken(">=", tokens),
		shift_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function equality_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [relational_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [equality_expression(context, tokens),
		getToken("==", tokens),
		relational_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [equality_expression(context, tokens),
		getToken("!=", tokens),
		relational_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function AND_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [equality_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [AND_expression(context, tokens),
		getToken("&", tokens),
		equality_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function exclusive_OR_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [AND_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [exclusive_OR_expression(context, tokens),
		getToken("^", tokens),
		AND_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function inclusive_OR_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [exclusive_OR_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [inclusive_OR_expression(context, tokens),
		getToken("|", tokens),
		exclusive_OR_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function logical_AND_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [inclusive_OR_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [logical_AND_expression(context, tokens),
		getToken("&&", tokens),
		inclusive_OR_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function logical_OR_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [logical_AND_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [logical_OR_expression(context, tokens),
		getToken("||", tokens),
		logical_AND_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function conditional_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [logical_OR_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [logical_OR_expression(context, tokens),
		getToken("?", tokens),
		expression(context, tokens),
		getToken(":", tokens),
		conditional_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null){
		// TODO:
	}
	return null;
}

function assignment_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [conditional_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [unary_expression(context, tokens),
		assignment_operator(context, tokens),
		assignment_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function assignment_operator(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("=", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("*=", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("/=", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("%=", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("+=", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("-=", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("<<=", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken(">>=", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("&=", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("^=", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("|=", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function constant_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [conditional_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [assignment_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [expression(context, tokens),
		getToken(",", tokens),
		assignment_expression(context, tokens)
	];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}
const {getToken} = require('./utils');
const expressions = require('./expressions');

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
	init_declarator: init_declarator,
	initializer: initializer,
	atomic_type_specifier: atomic_type_specifier,
	struct_or_union_specifier: struct_or_union_specifier,
	enum_specifier: enum_specifier,
	typedef_name: typedef_name,
	struct_or_union: struct_or_union,
	struct_declaration_list: struct_declaration_list,
	struct_declaration: struct_declaration,
	specifier_qualifier_list: specifier_qualifier_list,
	struct_declarator_list: struct_declarator_list,
	struct_declarator: struct_declarator,
	enumerator_list: enumerator_list,
	enumerator: enumerator,
	type_name: type_name,
	pointer: pointer,
	direct_declarator: direct_declarator,
	type_qualifier_list: type_qualifier_list,
	parameter_type_list: parameter_type_list,
	identifier_list: identifier_list,
	parameter_list: parameter_list,
	parameter_declaration: parameter_declaration,
	abstract_declarator: abstract_declarator,
	initializer_list: initializer_list
};

/* declaration{
	type: "declaration"
	specifiers?: Array of specifier in declaration_specifiers
	init_declarators? Array of init_declarator in init_declarator_list
	static_assert? Object of static_assert
} */

function declaration(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [declaration_specifiers(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? init_declarator_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-2] ? getToken(";", tokens) : null);
	if(exprs[0] != null && exprs[2] != null){
		return {
			type: "declaration",
			specifiers: exprs[0].specifiers,
			init_declarators: exprs[1] ? exprs[1].init_declarators : null
		};
	}
	tokens.cursor = cursor;
	exprs = [static_assert_declaration(context, tokens)];
	if(exprs[0] != null){
		return {
			type: "declaration",
			static_assert: exprs[0]
		};
	}
	return null;
}

/* storage_class_specifier: {
	type: "storage_class_specifier"
	value: String of specifier name
} */
function storage_class_specifier(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("typedef", tokens)];
	if(exprs[0] != null){
		return {
			type: "storage_class_specifier",
			value: "typedef"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("extern", tokens)];
	if(exprs[0] != null){
		return {
			type: "storage_class_specifier",
			value: "extern"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("static", tokens)];
	if(exprs[0] != null){
		return {
			type: "storage_class_specifier",
			value: "static"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("_Thread_local", tokens)];
	if(exprs[0] != null){
		return {
			type: "storage_class_specifier",
			value: "_Thread_local"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("auto", tokens)];
	if(exprs[0] != null){
		return {
			type: "storage_class_specifier",
			value: "auto"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("register", tokens)];
	if(exprs[0] != null){
		return {
			type: "storage_class_specifier",
			value: "register"
		};
	}
	return null;
}

function static_assert_declaration(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("_Static_assert", tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? expressions.constant_expression(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("string", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(";", tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null && exprs[5] != null && exprs[6] != null){
		// TODO:
	}
	return null;
}

/* type_specifier: {
	type: "type_specifier"
	value: String of specifier name
	specifier?: Object of specifier body, if needed
} */

function type_specifier(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("void", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "void"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("char", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "char"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("short", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "short"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("int", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "int"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("long", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "long"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("float", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "float"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("double", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "double"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("signed", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "signed"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("unsigned", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "unsigned"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("_Bool", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "_Bool"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("_Complex", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "_Complex"
		};
	}
	tokens.cursor = cursor;
	exprs = [atomic_type_specifier(context, tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "atomic_type_specifier",
			specifier: exprs[0]
		};
	}
	tokens.cursor = cursor;
	exprs = [struct_or_union_specifier(context, tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "struct_or_union_specifier",
			specifier: exprs[0]
		};
	}
	tokens.cursor = cursor;
	exprs = [enum_specifier(context, tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "enum_specifier",
			specifier: exprs[0]
		};
	}
	tokens.cursor = cursor;
	exprs = [typedef_name(context, tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "typedef_name",
			specifier: exprs[0]
		};
	}
	return null;
}

function atomic_type_specifier(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("_Atomic", tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? type_name(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(")", tokens) : null);
	if(exprs[0] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null){
		// TODO:
	}
	return null;
}

function type_name(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [specifier_qualifier_list(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? abstract_declarator(context, tokens) : null);
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function struct_or_union_specifier(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [struct_or_union(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("identifier", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("{", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? struct_declaration_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("}", tokens) : null);
	if(exprs[0] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [struct_or_union(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("identifier", tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	return null;
}

function struct_declaration_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [struct_declaration(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [struct_declaration_list(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? struct_declaration(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	return null;
}

function specifier_qualifier_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [type_specifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? specifier_qualifier_list(context, tokens) : null);
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [type_qualifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? specifier_qualifier_list(context, tokens) : null);
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function struct_declaration(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [specifier_qualifier_list(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? struct_declarator_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(";", tokens) : null);
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

function struct_declarator_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [struct_declarator(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [struct_declaration_list(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? struct_declarator(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function struct_declarator(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [declarator(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [declarator(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken(":", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? expressions.constant_expression(context, tokens) : null);
	if(exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function struct_or_union(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("struct", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("union", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function enum_specifier(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("enum", tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("identifier", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("{", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? enumerator_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("}", tokens) : null);
	if(exprs[0] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("enum", tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("identifier", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("{", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? enumerator_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("}", tokens) : null);
	if(exprs[0] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null && exprs[5] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("enum", tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("identifier", tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	return null;
}

function enumerator_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [enumerator(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [enumerator_list(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? enumerator(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function enumerator(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("identifier", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("identifier", tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("=", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? expressions.constant_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function typedef_name(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("identifier", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

/* type_qualifier: {
	type: "type_qualifier"
	value: String of qualifier name
} */
function type_qualifier(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("const", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_qualifier",
			value: "const"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("restrict", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_qualifier",
			value: "restrict"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("volatile", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_qualifier",
			value: "volatile"
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("_Atomic", tokens)];
	if(exprs[0] != null){
		return {
			type: "type_qualifier",
			value: "_Atomic"
		};
	}
	return null;
}

function function_specifier(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("inline", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("_Noreturn", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
}

function alignment_specifier(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("_Alignas", tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? type_name(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(")", tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("_Alignas", tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? expressions.constant_expression(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(")", tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null){
		// TODO:
	}
}

/* declaration_specifiers{
	type: "declaration_specifiers"
	specifiers: Array of specifiers
} */
function declaration_specifiers(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [storage_class_specifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? declaration_specifiers(context, tokens) : null);
	if(exprs[0] != null){
		if(exprs[1]){
			exprs[1].specifiers.unshift(exprs[0]);
			return exprs[1];
		}else{
			return {
				type: "declaration_specifiers",
				specifiers: [exprs[0]]
			};
		}
	}
	tokens.cursor = cursor;
	exprs = [type_specifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? declaration_specifiers(context, tokens) : null);
	if(exprs[0] != null){
		if(exprs[1]){
			exprs[1].specifiers.unshift(exprs[0]);
			return exprs[1];
		}else{
			return {
				type: "declaration_specifiers",
				specifiers: [exprs[0]]
			};
		}
	}
	tokens.cursor = cursor;
	exprs = [type_qualifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? declaration_specifiers(context, tokens) : null);
	if(exprs[0] != null){
		if(exprs[1]){
			exprs[1].specifiers.unshift(exprs[0]);
			return exprs[1];
		}else{
			return {
				type: "declaration_specifiers",
				specifiers: [exprs[0]]
			};
		}
	}
	tokens.cursor = cursor;
	exprs = [function_specifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? declaration_specifiers(context, tokens) : null);
	if(exprs[0] != null){
		if(exprs[1]){
			exprs[1].specifiers.unshift(exprs[0]);
			return exprs[1];
		}else{
			return {
				type: "declaration_specifiers",
				specifiers: [exprs[0]]
			};
		}
	}
	tokens.cursor = cursor;
	exprs = [alignment_specifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? declaration_specifiers(context, tokens) : null);
	if(exprs[0] != null){
		if(exprs[1]){
			exprs[1].specifiers.unshift(exprs[0]);
			return exprs[1];
		}else{
			return {
				type: "declaration_specifiers",
				specifiers: [exprs[0]]
			};
		}
	}
	return null;
}

function initializer(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [expressions.assignment_expression(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("{", tokens)];
	exprs.push(exprs[exprs.length-1] ? initializer_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("}", tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("{", tokens)];
	exprs.push(exprs[exprs.length-1] ? initializer_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("}", tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null){
		// TODO:
	}
	return null;
}

function initializer_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [designation(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? initializer(context, tokens) : null);
	if(exprs[1] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [initializer_list(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? designation(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? initializer(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[3] != null){
		// TODO:
	}
	return null;
}

function designation(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [designator_list(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("=", tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	return null;
}

function designator_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [designator(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [designator_list(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? designator(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	return null;
}

function designator(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("[", tokens)];
	exprs.push(exprs[exprs.length-1] ? expressions.constant_expression(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("]", tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken(".", tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("identifier", tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	return null;
}

/* declarator{
	type: "declarator",
	pointers? Array of pointers in pointer
	direct_declarator: Object of direct_declarator
} */
function declarator(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [pointer(context, tokens)];
	exprs.push(direct_declarator(context, tokens));
	if(exprs[1] != null){
		var ret = {
			type: "declarator",
			direct_declarator: exprs[1]
		};
		if(exprs[0] != null){
			ret.pointers = exprs[0].pointers;
		}
		return ret;
	}
	return null;
}

/* direct_declarator{
	type: "direct_declarator",
	tails: Array of direct_declarator_tail
} */
function direct_declarator(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("identifier", tokens)];
	exprs.push(exprs[exprs.length-1] ? direct_declarator_tail(context, tokens) : null);
	if(exprs[0] != null){
		var ret = {
			type: "direct_declarator",
			tails: [{
				type: "direct_declarator_tail",
				identifier: exprs[0]
			}]
		};
		if(exprs[1] != null){
			ret.tails = ret.tails.concat(exprs[1]);
		}
		return ret;
	}
	tokens.cursor = cursor;
	exprs = [getToken("(", tokens)];
	exprs.push(exprs[exprs.length-1] ? declarator(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? direct_declarator_tail(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		var ret = {
			type: "direct_declarator",
			tails: [{
				type: "direct_declarator_tail",
				declarator: exprs[1]
			}]
		};
		if(exprs[3] != null){
			ret.tails = ret.tails.concat(exprs[3]);
		}
		return ret;
	}
	return null;
}

/* direct_declarator_tail{
	type: "direct_declarator_tail",
	identifier?: Object of identifier
	declarator?: Object of declarator
	parameter_type_list?: Object of parameter_type_list
	identifier_list?: Object of identifier_list
	isStatic?: True to indicate static
	isVariable?: True to indicate variable-length array
	type_qualifier_list?: Object of type_qualifier_list
	assignment_expression?: Object of assignment_expression
}
	direct_declarator_tail is created to eliminate left recursion
	return an array of direct_declarator_tail
*/
function direct_declarator_tail(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("[", tokens)];
	exprs.push(exprs[exprs.length-1] ? type_qualifier_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-2] ? expressions.assignment_expression(context, tokens) : null);
	exprs.push(exprs[exprs.length-3] ? getToken("]", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? direct_declarator_tail(context, tokens) : null);
	if(exprs[0] != null && exprs[3] != null){
		var tailObj = {
			type: "direct_declarator_tail",
			type_qualifier_list: exprs[1],
			assignment_expression: exprs[2]
		};
		if(exprs[4] != null){
			exprs[4].unshift(tailObj);
			return exprs[4];
		}else{
			return [tailObj];
		}
	}
	tokens.cursor = cursor;
	exprs = [getToken("[", tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("static", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? type_qualifier_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-2] ? expressions.assignment_expression(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("]", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? direct_declarator_tail(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[3] != null && exprs[4] != null){
		var tailObj = {
			type: "direct_declarator_tail",
			type_qualifier_list: exprs[2],
			assignment_expression: exprs[3],
			isStatic: true
		};
		if(exprs[5] != null){
			exprs[5].unshift(tailObj);
			return exprs[5];
		}else{
			return [tailObj];
		}
	}
	tokens.cursor = cursor;
	exprs = [getToken("[", tokens)];
	exprs.push(exprs[exprs.length-1] ? type_qualifier_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("static", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? expressions.assignment_expression(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("]", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? direct_declarator_tail(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null){
		var tailObj = {
			type: "direct_declarator_tail",
			type_qualifier_list: exprs[1],
			assignment_expression: exprs[3],
			isStatic: true
		};
		if(exprs[5] != null){
			exprs[5].unshift(tailObj);
			return exprs[5];
		}else{
			return [tailObj];
		}
	}
	tokens.cursor = cursor;
	exprs = [getToken("[", tokens)];
	exprs.push(exprs[exprs.length-1] ? type_qualifier_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-2] ? getToken("*", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("]", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? direct_declarator_tail(context, tokens) : null);
	if(exprs[0] != null && exprs[2] != null && exprs[3] != null){
		var tailObj = {
			type: "direct_declarator_tail",
			type_qualifier_list: exprs[1],
			isVariable: true
		};
		if(exprs[4] != null){
			exprs[4].unshift(tailObj);
			return exprs[4];
		}else{
			return [tailObj];
		}
	}
	tokens.cursor = cursor;
	exprs = [getToken("(", tokens)];
	exprs.push(exprs[exprs.length-1] ? parameter_type_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? direct_declarator_tail(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		var tailObj = {
			type: "direct_declarator_tail",
			parameter_type_list: exprs[1]
		};
		if(exprs[3] != null){
			exprs[3].unshift(tailObj);
			return exprs[3];
		}else{
			return [tailObj];
		}
	}
	tokens.cursor = cursor;
	exprs = [getToken("(", tokens)];
	exprs.push(exprs[exprs.length-1] ? identifier_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-2] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? direct_declarator_tail(context, tokens) : null);
	if(exprs[0] != null && exprs[2] != null){
		var tailObj = {
			type: "direct_declarator_tail",
			identifier_list: exprs[1]
		};
		if(exprs[3] != null){
			exprs[3].unshift(tailObj);
			return exprs[3];
		}else{
			return [tailObj];
		}
	}
	return null;
}

function parameter_type_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [parameter_list(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [parameter_list(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("...", tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function parameter_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [parameter_declaration(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [parameter_list(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? parameter_declaration(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function parameter_declaration(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [declaration_specifiers(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? declarator(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [declaration_specifiers(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? abstract_declarator(context, tokens) : null);
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function abstract_declarator(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [pointer(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [pointer(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? direct_abstract_declarator(context, tokens) : null);
	if(exprs[1] != null){
		// TODO:
	}
	return null;
}

function direct_abstract_declarator(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("(", tokens)];
	exprs.push(exprs[exprs.length-1] ? abstract_declarator(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(")", tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [direct_abstract_declarator(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("[", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? type_qualifier_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? expressions.assignment_expression(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("]", tokens) : null);
	if(exprs[1] != null && exprs[4] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [direct_abstract_declarator(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("[", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("static", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? type_qualifier_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? expressions.assignment_expression(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("]", tokens) : null);
	if(exprs[1] != null && exprs[2] != null && exprs[4] != null && exprs[5] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [direct_abstract_declarator(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("[", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? type_qualifier_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("static", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? expressions.assignment_expression(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("]", tokens) : null);
	if(exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null && exprs[5] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [direct_abstract_declarator(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("[", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("*", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("]", tokens) : null);
	if(exprs[1] != null && exprs[2] != null && exprs[3] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [direct_abstract_declarator(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? parameter_type_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(")", tokens) : null);
	if(exprs[1] != null && exprs[3] != null){
		// TODO:
	}
	return null;
}

function identifier_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("identifier", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [identifier_list(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("...", tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

/* type_qualifier_list{
	type: "type_qualifier_list"
	qualifiers: Array of type_qualifiers
} */
function type_qualifier_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [type_qualifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? type_qualifier(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		exprs[1].qualifiers.push(exprs[0]);
		return exprs[1];
	}else if(exprs[0] != null){
		return {
			type: "type_qualifier_list",
			qualifiers: [exprs[0]]
		};
	}
	return null;
}

/* pointer{
	type: "pointer"
	pointers: Array of [Array of type_qualifiers in type_qualifier_list or null]
} */
function pointer(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("*", tokens)];
	exprs.push(exprs[exprs.length-1] ? type_qualifier_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-2] ? pointer(context, tokens) : null);
	if(exprs[0] != null && exprs[2] != null){
		exprs[2].pointers.push(exprs[1]);
		return exprs[2];
	}else if(exprs[0] != null){
		return {
			type: "pointer",
			pointers: [exprs[1]]
		};
	}
	return null;
}

/* init_declarator{
	type: "init_declarator",
	declarator: Object of declarator,
	initializer?: Object of initializer
} */
function init_declarator(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [declarator(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("=", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? initializer(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		return{
			type: "init_declarator",
			declarator: exprs[0],
			initializer: exprs[2]
		};
	}else if(exprs[0] != null){
		return{
			type: "init_declarator",
			declarator: exprs[0]
		};
	}
	return null;
}

/* init_declarator_list{
	type: "init_declarator_list",
	init_declarators: Array of init_declarator
} */
function init_declarator_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [init_declarator(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? init_declarator_list(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		exprs[0].init_declarators.push(exprs[2]);
		return exprs[0];
	}else if(exprs[0] != null && exprs[1] == null && exprs[2] == null){
		return{
			type: "init_declarator_list",
			init_declarators: [exprs[0]]
		};
	}
	return null;
}
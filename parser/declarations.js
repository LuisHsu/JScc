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
	var exprs = [getToken("typedef", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("extern", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("static", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("_Thread_local", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("auto", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("register", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function static_assert_declaration(context, tokens){

}

function type_specifier(context, tokens){
	var exprs = [getToken("void", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("char", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("short", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("int", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("long", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("float", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("double", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("signed", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("unsigned", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("_Bool", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("_Complex", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [atomic_type_specifier(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [struct_or_union_specifier(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [enum_specifier(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [typedef_name(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function atomic_type_specifier(context, tokens){

}

function struct_or_union_specifier(context, tokens){
	var exprs = [struct_or_union(context, tokens),
		getToken("identifier", tokens),
		getToken("{", tokens),
		struct_declaration_list(context, tokens),
		getToken("}", tokens)
	];
	if(exprs[0] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null){
		// TODO:
	}
	exprs = [struct_or_union(context, tokens),
		getToken("identifier", tokens)
	];
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	return null;
}

function struct_declaration_list(context, tokens){
	var exprs = [struct_declaration(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [struct_declaration_list(context, tokens), struct_declaration(context, tokens)];
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	return null;
}

function specifier_qualifier_list(context, tokens){

}

function struct_declaration(context, tokens){
	var exprs = [specifier_qualifier_list(context, tokens),
		struct_declarator_list(context, tokens),
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

function struct_or_union(context, tokens){
	var exprs = [getToken("struct", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [getToken("union", tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	return null;
}

function enum_specifier(context, tokens){

}

function typedef_name(context, tokens){

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

function initializer(context, tokens){

}

function declarator(context, tokens){

}

function init_declarator(context, tokens){
	var exprs = [declarator(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [declarator(context, tokens), getToken("=", tokens), init(context, tokens)];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}

function init_declarator_list(context, tokens){
	var exprs = [init_declarator(context, tokens)];
	if(exprs[0] != null){
		// TODO:
	}
	exprs = [init_declarator_list(context, tokens), getToken(",", tokens), init_declarator(context, tokens)];
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
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
	init_declarator: init_declarator,
	initializer: initializer,
	atomic_type_specifier: atomic_type_specifier,
	struct_or_union_specifier: struct_or_union_specifier,
	enum_specifier: enum_specifier,
	typedef_name: typedef_name,
	struct_or_union: struct_or_union,
	struct_declaration_list: struct_declaration_list,
	struct_declaration: struct_declaration,
	specifier_qualifier_list: specifier_qualifier_list
};
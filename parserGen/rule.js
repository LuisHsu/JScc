
module.exports = {
	start: "translation_unit",
	primary_expression: [
		["identifier"],
		["floating"],
		["integer"],
		["character"],
		["string"],
		["(","expression",")"],
		["generic_selection"]
	],
	generic_selection: [
		["_Generic", "(", "assignment_expression", ",", "generic_assoc_list"]
	],
	generic_assoc_list: [
		["generic_association"],
		["generic_assoc_list", ",", "generic_association"]
	],
	generic_association: [
		["type_name", ":", "assignment_expression"],
		["default", ":", "assignment_expression"]
	],
	postfix_expression: [
		["primary_expression"],
		["postfix_expression", "[", "expression", "]"],
		["postfix_expression", "(", "argument_expression_list\t", ")"],
		["postfix_expression", ".", "identifier"],
		["postfix_expression", "->", "identifier"],
		["postfix_expression", "++"],
		["postfix_expression", "--"],
		["(", "type_name", ")", "{", "initializer_list", "}"],
		["(", "type_name", ")", "{", "initializer_list", ",", "}"]
	],
	argument_expression_list: [
		["assignment_expression"],
		["argument_expression_list", ",", "assignment_expression"]
	],
	unary_expression: [
		["postfix_expression"],
		["++", "unary_expression"],
		["--", "unary_expression"],
		["unary_operator", "cast_expression"],
		["sizeof", "unary_expression"],
		["sizeof", "(",  "type_name", ")"],
		["_Alignof", "(", "type_name", ")"]
	],
	unary_operator: [
		["&"],
		["*"],
		["+"],
		["-"],
		["~"],
		["!"]
	],
	cast_expression: [
		["unary_expression"],
		["(", "type_name", ")", "cast_expression"]
	],
	multiplicative_expression: [
		["cast_expression"],
		["multiplicative_expression", "*", "cast_expression"],
		["multiplicative_expression", "/", "cast_expression"],
		["multiplicative_expression", "%", "cast_expression"]
	],
	additive_expression: [
		["multiplicative_expression"],
		["additive_expression", "+", "multiplicative_expression"],
		["additive_expression", "-", "multiplicative_expression"]
	],
	shift_expression: [
		["additive_expression"],
		["shift_expression", "<<", "additive_expression"],
		["shift_expression", ">>", "additive_expression"]
	],
	relational_expression: [
		["shift_expression"],
		["relational_expression", "<", "shift_expression"],
		["relational_expression", ">", "shift_expression"],
		["relational_expression", ">=", "shift_expression"],
		["relational_expression", "<=", "shift_expression"]
	],
	equality_expression: [
		["relational_expression"],
		["equality_expression", "==", "relational_expression"],
		["equality_expression", "!=", "relational_expression"]
	],
	and_expression: [
		["equality_expression"],
		["and_expression", "&", "equality_expression"]
	],
	exclusive_or_expression: [
		["and_expression"],
		["exclusive_or_expression", "^", "and_expression"]
	],
	inclusive_or_expression: [
		["exclusive_or_expression"],
		["inclusive_or_expression", "|", "exclusive_or_expression"]
	],
	logical_and_expression: [
		["inclusive_or_expression"],
		["logical_and_expression", "&&", "inclusive_or_expression"]
	],
	logical_or_expression: [
		["logical_and_expression"],
		["logical_or_expression", "||", "logical_and_expression"]
	],
	conditional_expression: [
		["logical_or_expression"],
		["logical_or_expression", "?", "expression", ":", "conditional_expression"]
	],
	assignment_expression: [
		["conditional_expression"],
		["unary_expression", "assignment_operator", "assignment_expression"]
	],
	assignment_operator: [
		["="],
		["*="],
		["/="],
		["%="],
		["+="],
		["-="],
		["<<="],
		[">>="],
		["&="],
		["^="],
		["|="]
	],
	expression: [
		["assignment_expression"],
		["expression", ",", "assignment_expression"]
	],
	constant_expression: [
		["conditional_expression"]
	],
	declaration: [
		["declaration_specifiers", "init_declarator_list\t", ";"],
		["static_assert_declaration"]
	],
	declaration_specifiers: [
		["storage_class_specifier", "declaration_specifiers\t"],
		["type_specifier", "declaration_specifiers\t"],
		["type_qualifier", "declaration_specifiers\t"],
		["function_specifier", "declaration_specifiers\t"],
		["alignment_specifier", "declaration_specifiers\t"]
	],
	init_declarator_list: [
		["init_declarator"],
		["init_declarator_list", ",", "init_declarator"]
	],
	init_declarator: [
		["declarator"],
		["declarator", "=", "initializer"]
	],
	storage_class_specifier: [
		["typedef"],
		["extern"],
		["static"],
		["_Thread_local"],
		["auto"],
		["register"]
	],
	type_specifier: [
		["void"],
		["char"],
		["short"],
		["int"],
		["long"],
		["float"],
		["double"],
		["signed"],
		["unsigned"],
		["_Bool"],
		["_Complex"],
		["atomic_type_specifier"],
		["struct_or_union_specifier"],
		["enum_specifier"],
		["typedef_name"]
	],
	struct_or_union_specifier: [
		["struct_or_union", "identifier\t", "{", "struct_declaration_list", "}"],
		["struct_or_union", "identifier"]
	],
	struct_or_union: [
		["struct"],
		["union"]
	],
	struct_declaration_list: [
		["struct_declaration"],
		["struct_declaration_list", "struct_declaration"]
	],
	struct_declaration: [
		["specifier_qualifier_list", "struct_declarator_list\t", ";"],
		["static_assert_declaration"]
	],
	specifier_qualifier_list: [
		["type_specifier", "specifier_qualifier_list\t"],
		["type_qualifier", "specifier_qualifier_list\t"]
	],
	struct_declarator_list: [
		["struct_declarator"],
		["struct_declarator_list", ",", "struct_declarator"]
	],
	struct_declarator: [
		["declarator"],
		["declarator\t", ":", "constant_expression"]
	],
	enum_specifier: [
		["enum", "identifier\t", "{", "enumerator_list", "}"],
		["enum", "identifier\t", "{", "enumerator_list", ",", "}"],
		["enum", "identifier"]
	],
	enumerator_list: [
		["enumerator"],
		["enumerator_list", ",", "enumerator"]
	],
	enumerator: [
		["identifier"],
		["identifier", ",", "constant_expression"]
	],
	atomic_type_specifier: [
		["_Atomic", "(", "type_name", ")"]
	],
	type_qualifier: [
		["const"],
		["restrict"],
		["volatile"],
		["_Atomic"]
	],
	function_specifier: [
		["inline"],
		["_Noreturn"]
	],
	alignment_specifier: [
		["_Alignas", "(", "type_name", ")"],
		["_Alignas", "(", "constant_expression", ")"]
	],
	declarator: [
		["pointer\t", "direct_declarator"]
	],
	direct_declarator: [
		["identifier"],
		["(", "declarator", ")"],
		["direct_declarator", "[", "type_qualifier_list\t", "assignment_expression\t", "]"],
		["direct_declarator", "[", "static", "type_qualifier_list\t", "assignment_expression", "]"],
		["direct_declarator", "[", "type_qualifier_list", "static", "assignment_expression", "]"],
		["direct_declarator", "[", "type_qualifier_list\t", "*", "]"],
		["direct_declarator", "(", "parameter_type_list", ")"],
		["direct_declarator", "(", "identifier_list\t", ")"]
	],
	pointer: [
		["*", "type_qualifier_list\t"],
		["*", "type_qualifier_list\t", "pointer"]
	],
	type_qualifier_list: [
		["type_qualifier"],
		["type_qualifier_list", "type_qualifier"]
	],
	parameter_type_list: [
		["parameter_list"],
		["parameter_list", ",", "..."]
	],
	parameter_list: [
		["parameter_declaration"],
		["parameter_list", ",", "parameter_declaration"]
	],
	parameter_declaration: [
		["declaration_specifiers", "declarator"],
		["declaration_specifiers", "abstract_declarator\t"]
	],
	identifier_list: [
		["identifier"],
		["identifier_list", ",", "identifier"]
	],
	type_name: [
		["specifier_qualifier_list", "abstract_declarator\t"]
	],
	abstract_declarator: [
		["pointer"],
		["pointer\t", "direct_abstract_declarator"]
	],
	direct_abstract_declarator: [
		["(", "abstract_declarator", ")"],
		["direct_abstract_declarator\t", "[", "type_qualifier_list\t", "assignment_expression\t", "]"],
		["direct_abstract_declarator\t", "[", "static", "type_qualifier_list\t", "assignment_expression", "]"],
		["direct_abstract_declarator\t", "[", "type_qualifier_list", "static", "assignment_expression", "]"],
		["direct_abstract_declarator\t", "[", "*", "]"],
		["direct_abstract_declarator\t", "(", "parameter_type_list\t", ")"]
	],
	initializer: [
		["assignment_expression"],
		["{", "initializer_list", "}"],
		["{", "initializer_list", ",", "}"]
	],
	initializer_list: [
		["designation\t", "initializer"],
		["initializer_list", ",", "designation\t", "initializer"]
	],
	designation: [
		["designator_list", "="]
	],
	designator_list: [
		["designator"],
		["designator_list", "designator"]
	],
	designator: [
		["[", "constant_expression", "]"],
		[".", "identifier"]
	],
	static_assert_declaration: [
		["_Static_assert", "(", "constant_expression", ",", "string", ")", ";"]
	],
	statement: [
		["labeled_statement"],
		["compound_statement"],
		["expression_statement"],
		["selection_statement"],
		["iteration_statement"],
		["jump_statement"]
	],
	labeled_statement: [
		["identifier", ":", "statement"],
		["case", "constant_expression", ":", "statement"],
		["default", ":", "statement"]
	],
	compound_statement: [
		["{", "block_item_list\t", "}"]
	],
	block_item_list: [
		["block_item"],
		["block_item_list", "block_item"]
	],
	block_item: [
		["declaration"],
		["statement"]
	],
	expression_statement: [
		["expression\t", ";"]
	],
	selection_statement: [
		["if", "(", "expression", ")", "statement"],
		["if", "(", "expression", ")", "statement", "else", "statement"],
		["switch", "(", "expression", ")", "statement"]
	],
	iteration_statement: [
		["while", "(", "expression", ")", "statement"],
		["do", "statement", "while", "(", "expression", ")", ";"],
		["for", "(", "expression\t", ";", "expression\t", ";", "expression\t", ")", "statement"],
		["for", "(", "declaration", "expression\t", ";", "expression\t", ")", "statement"]
	],
	jump_statement: [
		["goto", "identifier", ";"],
		["continue", ";"],
		["break", ";"],
		["return", "expression\t", ";"]
	],
	translation_unit: [
		["external_declaration"],
		["translation_unit", "external_declaration"]
	],
	external_declaration: [
		["function_definition"],
		["declaration"]
	],
	function_definition: [
		["declaration_specifiers", "declarator", "declaration_list\t", "compound_statement"]
	],
	declaration_list: [
		["declaration"],
		["declaration_list", "declaration"]
	]
};
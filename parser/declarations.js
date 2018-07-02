//    Copyright 2018 Luis Hsu
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

const {getToken} = require('./utils');
const expressions = require('./expressions');

/** "宣告" 模組
 * @module Declarations
 * @requires Utils
 * @requires Expressions
 */
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

/** declaration "宣告" 節點
 * @class Declaration
 * @memberof module:Declarations
 * @property {string} type="declaration" 節點種類
 * @property {Array.<(module:Declarations.Storage_class_specifier|module:Declarations.Type_specifier|module:Declarations.Type_qualifier|module:Declarations.Function_specifier|module:Declarations.Alignment_specifier)>=} specifiers 宣告識別子裡的識別子陣列
 * @property {Array.<module:Declarations.Init_declarator>=} init_declarators 初始宣告子清單裡的初始宣告子陣列
 * @property {module:Declarations.Static_assert_declaration=} static_assert_declaration 靜態假設宣告
 */
/** 解析 declaration
 * @function
 * @memberof module:Declarations
 * @param {module:Parser.context} context 語法解析器的背景物件
 * @param {module:Lex.Token[]} tokens 輸入的單詞陣列
 */
function declaration(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [declaration_specifiers(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? init_declarator_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-2] ? getToken(";", tokens) : null);
	if(exprs[0] != null && exprs[2] != null){
		var firstSpecifier = exprs[0][0];
		var hasTypedef = firstSpecifier.type == "storage_class_specifier" && firstSpecifier.value == "typedef";
		var ret = {
			type: "declaration",
			specifiers: exprs[0],
			init_declarators: exprs[1] ? exprs[1] : null
		};
		if(hasTypedef && exprs[1]){
			var identifierTok = null;
			exprs[1].some((init_declarator) => {
				return init_declarator.declarator.direct_declarator.find((direct_declarator) => {
					if(direct_declarator.identifier){
						identifierTok = direct_declarator.identifier;
					}
				});
			});
			context.typedefs[identifierTok.value] = ret;
		}
		return ret;
	}
	tokens.cursor = cursor;
	exprs = [static_assert_declaration(context, tokens)];
	if(exprs[0] != null){
		return {
			type: "declaration",
			static_assert_declaration: exprs[0]
		};
	}
	return null;
}

/** storage_class_specifier 儲存識別子節點
 * @class Storage_class_specifier
 * @memberof module:Declarations
 * @property {string} type="storage_class_specifier" 節點種類
 * @property {string} value 識別子
 */
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

/** static_assert_declaration 靜態假設節點
 * @class Static_assert_declaration
 * @memberof module:Declarations
 * @property {string} type="static_assert_declaration" 節點種類
 * @property {module:Expression.Expression} expression 運算式
 * @property {string} message 錯誤訊息
 */
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
		return {
			type: "static_assert_declaration",
			expression: exprs[2],
			message: exprs[4]
		};
	}
	return null;
}

/** type_specifier 型別識別子節點
 * @class Type_specifier
 * @memberof module:Declarations
 * @property {string} type="type_specifier" 節點種類
 * @property {(module:Declarations.Atomic_type_specifier|module:Declarations.Struct_or_union_specifier|module:Declarations.Enum_specifier|module:Declarations.Typedef_name)=} specifier 識別子內容
 * @property {string} value 識別子標籤
 */
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
	exprs = [typedef_name(context, tokens)];
	if(exprs[0] != null){
		return {
			type: "type_specifier",
			value: "typedef_name",
			specifier: exprs[0]
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
	return null;
}

/** atomic_type_specifier 型別識別子節點
 * @class Atomic_type_specifier
 * @memberof module:Declarations
 * @property {string} type="atomic_type_specifier" 節點種類
 * @property {module:Declarations.Type_name} type_name 型別名稱
 */
function atomic_type_specifier(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("_Atomic", tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? type_name(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(")", tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null){
		return {
			type: "atomic_type_specifier",
			type_name: exprs[2]
		};
	}
	return null;
}

/** type_name 型別名稱節點
 * @class Type_name
 * @memberof module:Declarations
 * @property {string} type="type_name" 節點種類
 * @property {Array.<(module:Declarations.Type_specifier|module:Declarations.Type_qualifier)>} specifier_qualifiers 型別識別子或型別限定子陣列
 * @property {module:Declarations.Abstract_declarator=} abstract_declarator 抽象宣告子
 */
function type_name(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [specifier_qualifier_list(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? abstract_declarator(context, tokens) : null);
	if(exprs[0] != null){
		var ret = {
			type: "type_name",
			specifier_qualifiers: exprs[0]
		};
		if(exprs[1]){
			ret.abstract_declarator = exprs[1];
		}
		return ret;
	}
	return null;
}

/** struct_or_union_specifier 結構或列舉識別子節點
 * @class Struct_or_union_specifier
 * @memberof module:Declarations
 * @property {string} type="struct_or_union_specifier" 節點種類
 * @property {module:Lex.KeywordToken=} struct_or_union 結構或列舉
 * @property {module:Lex.IdentifierToken=} tag 名稱標籤
 * @property {Array.<module:Declarations.Struct_declaration=>} struct_declarations 結構宣告
 */
function struct_or_union_specifier(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [struct_or_union(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("identifier", tokens) : null);
	exprs.push(exprs[exprs.length-2] ? getToken("{", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? struct_declaration_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken("}", tokens) : null);
	if(exprs[0] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null){
		var ret = {
			type: "struct_or_union_specifier",
			struct_or_union: exprs[0],
			struct_declarations: exprs[3]
		};
		if(exprs[1]){
			ret.tag = exprs[1];
		}
		return ret;
	}
	tokens.cursor = cursor;
	exprs = [struct_or_union(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("identifier", tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		return {
			type: "struct_or_union_specifier",
			tag: exprs[1]
		};
	}
	return null;
}

/** struct_declaration_list 結構宣告清單
 * @function
 * @memberof module:Declarations
 * @return {Array.<module:Declarations.Struct_declaration>} 結構宣告陣列
 */
function struct_declaration_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [struct_declaration(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? struct_declaration_list(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		exprs[1].unshift(exprs[0]);
		return exprs[1];
	}else if(exprs[0] != null){
		return [exprs[0]];
	}
	return null;
}

/** specifier_qualifier_list 型別名稱節點
 * @function
 * @memberof module:Declarations
 * @return {Array.<(module:Declarations.Type_specifier|module:Declarations.Type_qualifier)>} 型別識別子或型別限定子陣列
 */
function specifier_qualifier_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [type_specifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? specifier_qualifier_list(context, tokens) : null);
	if(exprs[0] != null){
		if(exprs[1] != null){
			exprs[1].unshift(exprs[0]);
			return exprs[1];
		}else{
			return [exprs[0]];
		}
	}
	tokens.cursor = cursor;
	exprs = [type_qualifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? specifier_qualifier_list(context, tokens) : null);
	if(exprs[0] != null){
		if(exprs[1] != null){
			exprs[1].unshift(exprs[0]);
			return exprs[1];
		}else{
			return [exprs[0]];
		}
	}
	return null;
}

/** struct_declaration 結構宣告子
 * @class Struct_declaration
 * @memberof module:Declarations
 * @property {string} type="struct_declaration" 節點種類
 * @property {Array.<(module:Declarations.Type_specifier|module:Declarations.Type_qualifier)>=} specifier_qualifier_list 型別識別子或型別限定子陣列
 * @property {Array.<module:Declarations.Struct_declarator>=} struct_declarator_list 結構宣告子陣列
 * @property {module:Declarations.Static_assert_declaration=} static_assert_declaration 靜態假設宣告
 */
function struct_declaration(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [specifier_qualifier_list(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? struct_declarator_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(";", tokens) : null);
	if(exprs[0] != null && exprs[2] != null){
		return {
			type: "struct_declaration",
			specifier_qualifier_list: exprs[0],
			struct_declarator_list: exprs[1]
		};
	}
	tokens.cursor = cursor;
	exprs = [static_assert_declaration(context, tokens)];
	if(exprs[0] != null){
		return {
			type: "struct_declaration",
			static_assert_declaration: exprs[0]
		};
	}
	return null;
}

/** struct_declarator_list 結構宣告子清單
 * @memberof module:Declarations
 * @return {Array.<module:Declarations.Struct_declarator>}
 */
function struct_declarator_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [struct_declarator(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? struct_declarator_list(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		exprs[2].unshift(exprs[0]);
		return exprs[2];
	}else if(exprs[0] != null){
		return [exprs[0]];
	}
	return null;
}

/** struct_declarator 結構宣告子
 * @class Struct_declarator
 * @memberof module:Declarations
 * @property {string} type="struct_declarator" 節點種類
 * @property {module:Declarations.Declarator} declarator 宣告子
 * @property {module:Expressions.Constant_expression=} constant_expression 常數運算式
 */
function struct_declarator(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [declarator(context, tokens)];
	if(exprs[0] != null){
		return {
			type: "struct_declarator",
			declarator: exprs[0]
		};
	}
	tokens.cursor = cursor;
	exprs = [declarator(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken(":", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? expressions.constant_expression(context, tokens) : null);
	if(exprs[1] != null && exprs[2] != null){
		var ret = {
			type: "struct_declarator",
			constant_expression: exprs[2]
		};
		ret.declarator = exprs[0];
		return ret;
	}
	return null;
}

/** struct_or_union 結構或聯集關鍵字
 * @function
 * @memberof module:Declarations
 * @return {module:Lex.KeywordToken} 關鍵字單詞
 */
function struct_or_union(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("struct", tokens)];
	if(exprs[0] != null){
		return exprs[0];
	}
	tokens.cursor = cursor;
	exprs = [getToken("union", tokens)];
	if(exprs[0] != null){
		return exprs[0];
	}
	return null;
}

/** enum_specifier 列舉識別子
 * @class Enum_specifier
 * @memberof module:Declarations
 * @property {string} type="enum_specifier" 節點種類
 * @property {module:Lex.IdentifierToken=} tag 標籤名稱
 * @property {Array.<module:Declarations.Enumerator>=} enumerators 列舉子陣列
 */
function enum_specifier(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("enum", tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("identifier", tokens) : null);
	exprs.push(exprs[exprs.length-2] ? getToken("{", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? enumerator_list(context, tokens) : null);
	exprs.push(exprs[exprs.length-2] ? getToken("}", tokens) : null);
	if(exprs[0] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null){
		var ret = {
			type: "enum_specifier",
			enumerators: exprs[3]
		};
		if(exprs[1]){
			ret.tag = exprs[1];
		}
		return ret;
	}else if(exprs[0] != null && exprs[1] != null){
		return {
			type: "enum_specifier",
			tag: exprs[1]
		};
	}
	return null;
}

/** enumerator_list 列舉子清單
 * @function
 * @memberof module:Declarations
 * @return {Array.<module:Declarations.Enumerator>}
 */
function enumerator_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [enumerator(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? enumerator_list(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		exprs[2].unshift(exprs[0]);
		return exprs[2];
	}else if(exprs[0] != null){
		return [exprs[0]];
	}
	return null;
}

/** enumerator 列舉子節點
 * @class Enumerator
 * @memberof module:Declarations
 * @property {string} type="enumerator" 節點種類
 * @property {module:Lex.IdentifierToken} identifier 列舉名稱
 * @property {module:Expressions.Constant_expression=} constant_expression 常數運算式
 */
function enumerator(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("identifier", tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken("=", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? expressions.constant_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		return {
			type: "enumerator",
			identifier: exprs[0],
			constant_expression: exprs[2]
		};
	}else if(exprs[0] != null && exprs[1] == null && exprs[2] == null){
		return {
			type: "enumerator",
			identifier: exprs[0]
		};
	}
	return null;
}

function typedef_name(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("identifier", tokens)];
	if(exprs[0] != null && context.typedefs[exprs[0].value]){
		return exprs[0];
	}
	return null;
}

/** type_qualifier 型別限定子節點
 * @class Type_qualifier
 * @memberof module:Declarations
 * @property {string} type="type_qualifier" 節點種類
 * @property {string} value 型別限定子名稱
 */
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

/** declaration_specifiers
 * @function
 * @memberof module:Declarations
 * @return {Array.<(module:Declarations.Storage_class_specifier|module:Declarations.Type_specifier|module:Declarations.Type_qualifier|module:Declarations.Function_specifier|module:Declarations.Alignment_specifier)>} specifiers 識別子陣列
 */
function declaration_specifiers(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [storage_class_specifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? declaration_specifiers(context, tokens) : null);
	if(exprs[0] != null){
		if(exprs[1]){
			exprs[1].unshift(exprs[0]);
			return exprs[1];
		}else{
			return [exprs[0]];
		}
	}
	tokens.cursor = cursor;
	exprs = [type_specifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? declaration_specifiers(context, tokens) : null);
	if(exprs[0] != null){
		if(exprs[1]){
			exprs[1].unshift(exprs[0]);
			return exprs[1];
		}else{
			return [exprs[0]];
		}
	}
	tokens.cursor = cursor;
	exprs = [type_qualifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? declaration_specifiers(context, tokens) : null);
	if(exprs[0] != null){
		if(exprs[1]){
			exprs[1].unshift(exprs[0]);
			return exprs[1];
		}else{
			return [exprs[0]];
		}
	}
	tokens.cursor = cursor;
	exprs = [function_specifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? declaration_specifiers(context, tokens) : null);
	if(exprs[0] != null){
		if(exprs[1]){
			exprs[1].unshift(exprs[0]);
			return exprs[1];
		}else{
			return [exprs[0]];
		}
	}
	tokens.cursor = cursor;
	exprs = [alignment_specifier(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? declaration_specifiers(context, tokens) : null);
	if(exprs[0] != null){
		if(exprs[1]){
			exprs[1].unshift(exprs[0]);
			return exprs[1];
		}else{
			return [exprs[0]];
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

/** declarator 宣告子節點
 * @class Declarator
 * @memberof module:Declarations
 * @property {string} type="declarator" 節點種類
 * @property {Array.<module:Declarations.Pointer>=} pointers 指標陣列
 * @property {module:Declarations.Direct_declarator} direct_declarator 一般宣告子
 */
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

/** direct_declarator 一般宣告子 (前)
 * @function
 * @memberof module:Declarations
 * @return {Array.<module:Declarations.Direct_declarator>} 一般宣告子後陣列
 */
function direct_declarator(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("identifier", tokens)];
	exprs.push(exprs[exprs.length-1] ? direct_declarator_tail(context, tokens) : null);
	if(exprs[0] != null){
		var ret = [{
			type: "direct_declarator",
			identifier: exprs[0]
		}];
		if(exprs[1] != null){
			ret = ret.concat(exprs[1]);
		}
		return ret;
	}
	tokens.cursor = cursor;
	exprs = [getToken("(", tokens)];
	exprs.push(exprs[exprs.length-1] ? declarator(context, tokens) : null);
	exprs.push(exprs[exprs.length-1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? direct_declarator_tail(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		var ret = [{
			type: "direct_declarator",
			declarator: exprs[1]
		}];
		if(exprs[3] != null){
			ret = ret.concat(exprs[3]);
		}
		return ret;
	}
	return null;
}

/** direct_declarator_tail 一般限定子（後）
 * @class Direct_declarator
 * @memberof module:Declarations
 * @property {string} type="direct_declarator" 節點種類
 * @property {module:Lex.IdentifierToken=} identifier 名稱節點
 * @property {module:Declarations.Declarator=} declarator 宣告子節點
 * @property {module:Declarations.Parameter_type_list=} parameter_type_list 參數列表
 * @property {module:Declarations.identifier_list=} identifier_list 名稱列表
 * @property {boolean=} isStatic 是否為靜態
 * @property {boolean=} isVariable 是否為可變長度陣列
 * @property {module:Declarations.Type_qualifier_list} type_qualifier_list 型別限定子清單
 * @property {module:Expression.Assignment_expression} assignment_expression 賦值運算式
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
			type: "direct_declarator",
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
			type: "direct_declarator",
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
			type: "direct_declarator",
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
			type: "direct_declarator",
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
			type: "direct_declarator",
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
			type: "direct_declarator",
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

/** type_qualifier_list 型別限定子列表節點
 * @class Type_qualifier_list
 * @memberof module:Declarations
 * @property {string} type="type_qualifier_list" 節點種類
 * @property {Array.<module:Declarations.Type_qualifier>} qualifiers 型別限定子陣列
 */
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

/** pointer 型別名稱節點
 * @class Pointer
 * @memberof module:Declarations
 * @property {string} type="pointer" 節點種類
 * @property {Array.<Array.<(module:Declarations.Type_specifier|null)>>} pointers ”型別限定子陣列或空值“的陣列
 */
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

/** init_declarator 初始宣告子節點
 * @class Init_declarator
 * @memberof module:Declarations
 * @property {string} type="init_declarator" 節點種類
 * @property {module:Declarations.Declarator} declarator 宣告子節點
 * @property {module:Declarations.Initializer=} initializer 初始者節點
 */
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

/** init_declarator_list 初始宣告子清單
 * @class Init_declarator_list
 * @memberof module:Declarations
 * @property {string} type="init_declarator_list" 節點種類
 * @property {Array.<module:Declarations.Init_declarator>=} init_declarators 初始宣告子陣列
 */
function init_declarator_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [init_declarator(context, tokens)];
	exprs.push(exprs[exprs.length-1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length-1] ? init_declarator_list(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		exprs[0].init_declarators.push(exprs[2]);
		return exprs[0];
	}else if(exprs[0] != null && exprs[1] == null && exprs[2] == null){
		return [exprs[0]];
	}
	return null;
}
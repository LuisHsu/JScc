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
const declarations = require('./declarations');

/** 運算式模組
 * @module Expressions
 * @requires Utils
 * @requires Declarations
 */
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

/** primary_expression 基本運算式節點
 * @class Expressions
 * @memberof module:Expressions
 * @property {string} type="primary_expression" 節點種類
 * @property {(module:Lex.IdentifierToken|module:Lex.FloatingToken|module:Lex.CharacterToken|module:Lex.IntegerToken|module:Lex.StringToken)=} token 單詞
 * @property {module:Expressions.Expression=} expression 運算式
 * @property {module:Expressions.Generic_selection=} generic_selection 通用選擇
 */
function primary_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("identifier", tokens)];
	if(exprs[0] != null){
		return {
			type: "primary_expression",
			token: exprs[0]
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("floating", tokens)];
	if(exprs[0] != null){
		return {
			type: "primary_expression",
			token: exprs[0]
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("character", tokens)];
	if(exprs[0] != null){
		return {
			type: "primary_expression",
			token: exprs[0]
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("integer", tokens)];
	if(exprs[0] != null){
		return {
			type: "primary_expression",
			token: exprs[0]
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("string", tokens)];
	if(exprs[0] != null){
		return {
			type: "primary_expression",
			token: exprs[0]
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("(", tokens)];
	exprs.push(exprs[exprs.length - 1] ? expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
	if(exprs[0] != null){
		return {
			type: "primary_expression",
			expression: exprs[1]
		};
	}
	tokens.cursor = cursor;
	exprs = [generic_selection(context, tokens)];
	if(exprs[0] != null){
		return {
			type: "primary_expression",
			generic_selection: exprs[0]
		};
	}
	return null;
}

/** generic_selection 通用選擇節點
 * @class Generic_selection
 * @memberof module:Expressions
 * @property {string} type="generic_selection" 節點種類
 * @property {module:Expressions.Assignment_expression=} assignment_expression 賦值運算式
 * @property {Array.<module:Expressions.Generic_association>=} generic_associations 通用關聯陣列
 */
function generic_selection(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("_Generic", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? assignment_expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? generic_assoc_list(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null && exprs[5] != null){
		return {
			type: "generic_selection",
			assignment_expression: exprs[2],
			generic_associations: exprs[4]
		};
	}
	return null;
}

/** generic_assoc_list 通用選擇清單
 * @memberof module:Expressions
 * @return {Array.<module:Expressions.Generic_association>}
 */
function generic_assoc_list(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [generic_association(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? generic_assoc_list(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		exprs[2].unshift(exprs[0]);
		return exprs[2];
	}
	if(exprs[0] != null && exprs[1] == null && exprs[2] == null){
		return [exprs[0]];
	}
	return null;
}


/** generic_association 通用選擇節點
 * @class Generic_association
 * @memberof module:Expressions
 * @property {string} type="generic_association" 節點種類
 * @property {module:Expressions.Assignment_expression=} assignment_expression 賦值運算式
 * @property {(module:Declarations.Type_name|module:Lex.KeywordToken)} type_name 型別名稱
 */
function generic_association(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [declarations.type_name(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken(":", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? assignment_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		return {
			type: "generic_association",
			assignment_expression: exprs[2],
			type_name: exprs[0]
		};
	}
	tokens.cursor = cursor;
	exprs = [getToken("default", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken(":", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? assignment_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		return {
			type: "generic_association",
			assignment_expression: exprs[2],
			type_name: exprs[0]
		};
	}
	return null;
}

/** postfix_expression 後綴運算式節點
 * @memberof module:Expressions
 * @return {Array.<module:Expressions.Postfix_expression>}
 */
function postfix_expression(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [primary_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? postfix_expression_tail(context, tokens) : null);
	if(exprs[0] != null){
		var node = {
			type: "postfix_expression",
			expression: exprs[0]
		};
		if(exprs[1] != null){
			exprs[1].unshift(node);
			return exprs[1];
		}else{
			return [node];
		}
	}
	tokens.cursor = cursor;
	exprs = [getToken("(", tokens)];
	exprs.push(exprs[exprs.length - 1] ? declarations.type_name(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken("{", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? declarations.initializer_list(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken("}", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? postfix_expression_tail(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null && exprs[5] != null){
		var node = {
			type: "postfix_expression",
			type_name: exprs[1],
			initializer_list: exprs[4]
		};
		if(exprs[6] != null){
			exprs[6].unshift(node);
			return exprs[6];
		}else{
			return [node];
		}
	}
	tokens.cursor = cursor;
	exprs = [getToken("(", tokens)];
	exprs.push(exprs[exprs.length - 1] ? declarations.type_name(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken("{", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? declarations.initializer_list(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken("}", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? postfix_expression_tail(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null && exprs[4] != null && exprs[5] != null && exprs[6] != null){
		var node = {
			type: "postfix_expression",
			type_name: exprs[1],
			initializer_list: exprs[4]
		};
		if(exprs[7] != null){
			exprs[7].unshift(node);
			return exprs[7];
		}else{
			return [node];
		}
	}
	return null;
}

/** postfix_expression 通用選擇節點
 * @class Postfix_expression
 * @memberof module:Expressions
 * @property {string} type="postfix_expression" 節點種類
 * @property {(module:Expressions.Expression|module:Expressions.Primary_expression)=} expression 運算式
 * @property {module:Declarations.Type_name=} type_name 型別名稱
 * @property {module:Declarations.Initializer_list=} initializer_list 初始子清單
 * @property {module:Declarations.Argument_expression_list=} argument_expression_list 參數運算式清單
 * @property {module:Lex.IdentifierToken=} identifier 名稱單詞
 * @property {boolean=} isArray 是否為陣列取值後綴
 * @property {boolean=} isValueOf 是否為取值後綴
 * @property {boolean=} isIndirect 是否為間接取值後綴
 * @property {boolean=} isIncrement 是否為增進後綴
 * @property {boolean=} isDecrement 是否為減退後綴
 */
function postfix_expression_tail(context, tokens){
	var cursor = tokens.cursor;
	var exprs = [getToken("[", tokens)];
	exprs.push(exprs[exprs.length - 1] ? expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken("]", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? postfix_expression_tail(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		var node = {
			type: "postfix_expression",
			expression: exprs[1],
			isArray: true
		};
		if(exprs[3] != null){
			exprs[3].unshift(node);
			return exprs[3];
		}else{
			return [node];
		}
	}
	tokens.cursor = cursor;
	exprs = [getToken("(", tokens)];
	exprs.push(exprs[exprs.length - 1] ? argument_expression_list(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? postfix_expression_tail(context, tokens) : null);
	if(exprs[0] != null && exprs[2] != null){
		var node = {
			type: "postfix_expression",
			argument_expression_list: exprs[1]
		};
		if(exprs[3] != null){
			exprs[3].unshift(node);
			return exprs[3];
		}else{
			return [node];
		}
	}
	tokens.cursor = cursor;
	exprs = [getToken(".", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("identifier", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? postfix_expression_tail(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		var node = {
			type: "postfix_expression",
			identifier: exprs[1],
			isValueOf: true
		};
		if(exprs[2] != null){
			exprs[2].unshift(node);
			return exprs[2];
		}else{
			return [node];
		}
	}
	tokens.cursor = cursor;
	exprs = [getToken("->", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("identifier", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? postfix_expression_tail(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		var node = {
			type: "postfix_expression",
			identifier: exprs[1],
			isIndirect: true
		};
		if(exprs[2] != null){
			exprs[2].unshift(node);
			return exprs[2];
		}else{
			return [node];
		}
	}
	tokens.cursor = cursor;
	exprs = [getToken("++", tokens)];
	exprs.push(exprs[exprs.length - 1] ? postfix_expression_tail(context, tokens) : null);
	if(exprs[0] != null){
		var node = {
			type: "postfix_expression",
			isIncrement: true
		};
		if(exprs[1] != null){
			exprs[1].unshift(node);
			return exprs[1];
		}else{
			return [node];
		}
	}
	tokens.cursor = cursor;
	exprs = [getToken("--", tokens)];
	exprs.push(exprs[exprs.length - 1] ? postfix_expression_tail(context, tokens) : null);
	if(exprs[0] != null){
		var node = {
			type: "postfix_expression",
			isDecrement: true
		};
		if(exprs[1] != null){
			exprs[1].unshift(node);
			return exprs[1];
		}else{
			return [node];
		}
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
	exprs = [argument_expression_list(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? assignment_expression(context, tokens) : null);
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
	exprs = [getToken("++", tokens)];
	exprs.push(exprs[exprs.length - 1] ? unary_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("--", tokens)];
	exprs.push(exprs[exprs.length - 1] ? unary_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [unary_operator(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? cast_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("sizeof", tokens)];
	exprs.push(exprs[exprs.length - 1] ? unary_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("sizeof", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? declarations.type_name(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null && exprs[3] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [getToken("_Alignof", tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("(", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? declarations.type_name(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
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
	exprs = [getToken("(", tokens)];
	exprs.push(exprs[exprs.length - 1] ? declarations.type_name(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(")", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? cast_expression(context, tokens) : null);
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
	exprs = [multiplicative_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("*", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? cast_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [multiplicative_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("/", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? cast_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [multiplicative_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("%", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? cast_expression(context, tokens) : null);
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
	exprs = [multiplicative_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("*", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? cast_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [multiplicative_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("/", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? cast_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [multiplicative_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("%", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? cast_expression(context, tokens) : null);
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
	exprs = [additive_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("+", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? multiplicative_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [additive_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("-", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? multiplicative_expression(context, tokens) : null);
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
	exprs = [shift_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("<<", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? additive_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [shift_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken(">>", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? additive_expression(context, tokens) : null);
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
	exprs = [relational_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("<", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? shift_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [relational_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken(">", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? shift_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [relational_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("<=", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? shift_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [relational_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken(">=", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? shift_expression(context, tokens) : null);
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
	exprs = [equality_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("==", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? relational_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	tokens.cursor = cursor;
	exprs = [equality_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("!=", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? relational_expression(context, tokens) : null);
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
	exprs = [AND_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("&", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? equality_expression(context, tokens) : null);
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
	exprs = [exclusive_OR_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("^", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? AND_expression(context, tokens) : null);
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
	exprs = [inclusive_OR_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("|", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? exclusive_OR_expression(context, tokens) : null);
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
	exprs = [logical_AND_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("&&", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? inclusive_OR_expression(context, tokens) : null);
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
	exprs = [logical_OR_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("||", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? logical_AND_expression(context, tokens) : null);
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
	exprs = [logical_OR_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken("?", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? expression(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? getToken(":", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? conditional_expression(context, tokens) : null);
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
	exprs = [unary_expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? assignment_operator(context, tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? assignment_expression(context, tokens) : null);
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
	exprs = [expression(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? getToken(",", tokens) : null);
	exprs.push(exprs[exprs.length - 1] ? assignment_expression(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null && exprs[2] != null){
		// TODO:
	}
	return null;
}
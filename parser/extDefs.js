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

const decl = require('./declarations');
const stmt = require('./statements');

/** 外部宣告模組
 * @module ExternalDefinitions
 * @requires Declarations
 * @requires Statements
 */
module.exports = {
	translation_unit: translation_unit,
	external_declaration: external_declaration,
	function_definition: function_definition,
	declaration_list: declaration_list
};

/** translation_unit 編譯單位節點
 * @class Translation_unit
 * @memberof module:ExternalDefinitions
 * @property {string} type="translation_unit" 節點種類
 * @property {Array.<(module:ExternalDefinitions.Function_definition|module:Declarations.Declaration)>} external_declarations 外部宣告陣列
 */
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

/** external_declaration 解析外部宣告
 * @memberof module:ExternalDefinitions
 * @return {(module:ExternalDefinitions.Function_definition|module:Declarations.Declaration)}
 */
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
	var exprs = [decl.declaration(context, tokens)];
	exprs.push(exprs[exprs.length - 1] ? declaration_list(context, tokens) : null);
	if(exprs[0] != null && exprs[1] != null){
		// TODO:
	}else if(exprs[0] != null){
		// TODO:
	}
	return null;
}
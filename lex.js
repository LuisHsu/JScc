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

const { Transform } = require('stream');
const { Buffer } = require('buffer');

class Lexer extends Transform{
	constructor(option){
		super(option);
		this.dataStr = "";
	}
	_transform(data, encoding, callback){
		this.dataStr += data.toString();
		try{
			for(var token = getToken(this); token != null; token = getToken(this)){
				this.push(JSON.stringify(token));
			}
		}catch(err){
			callback(err, null);
		}
	}
	_flush(data){
		this.dataStr += data.toString();
		try{
			for(var token = getToken(this); token != null; token = getToken(this)){
				this.push(JSON.stringify(token));
			}
		}catch(err){
			callback(err, null);
		}
	}
}
module.exports = new Lexer();

function getToken(lexer){
	var token;
	lexer.dataStr = lexer.dataStr.trim();
	if((token = tokKeyword(lexer))||(token = tokIdentifier(lexer))){
		return token;
	}
	return null;
}

function tokKeyword(lexer){
	var regex = /^(_Static_assert|_Thread_local|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|restrict|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn)/;
	var matched = regex.exec(lexer.dataStr);
	if(matched){
		lexer.dataStr = lexer.dataStr.substr(matched[0].length);
		return {
			type: 'keyword',
			value: matched[0]
		};
	}else{
		return null;
	}
}

function tokIdentifier(lexer){
	var regex = /^(\\u[\dA-Fa-f]{4}|\\U[\dA-Fa-f]{8}|[_A-Za-z])(\\u[\dA-Fa-f]{4}|\\U[\dA-Fa-f]{8}|\w)*/;
	var matched = regex.exec(lexer.dataStr);
	if(matched){
		lexer.dataStr = lexer.dataStr.substr(matched[0].length);
		regex = /(\\U[\dA-Fa-f]{8}|\\u[\dA-Fa-f]{4}|\w)/g;
		var ident = "";
		for(var character = regex.exec(matched[0]); character != null; character = regex.exec(matched[0])){
			character = character[0];
			if(character.startsWith("\\U")){
				// UInt32 character
				var tmpBuf = Buffer.alloc(4);
				tmpBuf.writeUInt32LE(parseInt(character.substr(2),16));
				ident += tmpBuf.toString();
			}else if(character.startsWith("\\u")){
				// UInt16 character
				var tmpBuf = Buffer.alloc(2);
				tmpBuf.writeUInt16LE(parseInt(character.substr(2),16));
				ident += tmpBuf.toString();
			}else{
				// basic source character
				ident += character;
			}
		}
		return {
			type: 'identifier',
			value: ident
		};
	}else{
		return null;
	}
}

function tokConstant(lexer){

}

function tokString(lexer){

}

function tokPunctuator(lexer){

}
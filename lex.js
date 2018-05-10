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
		this.on('unpipe',() => {
			var tokens = [];
			for(var token = this.getToken(this); token != null; token = this.getToken(this)){
				tokens.push(JSON.stringify(token));
			}
			var str = "";
			tokens.forEach((token) => {
				str += token + '\n';
			});
			this.push(str);
		});
	}
	_transform(data, encoding, callback){
		this.dataStr += data.toString();
		try{
			var tokens = [];
			for(var token = this.getToken(this); token != null; token = this.getToken(this)){
				tokens.push(JSON.stringify(token));
			}
			var str = "";
			tokens.forEach((token) => {
				str += token + '\n';
			});
			this.push(str);
		}catch(err){
			callback(err, null);
		}
	}
	getToken(){
		var token;
		this.dataStr = this.dataStr.trim();
		if(
			(token = this.tokString())||
			(token = this.tokCharacter())||
			(token = this.tokFloat())||
			(token = this.tokInteger())||
			(token = this.tokKeyword())||
			(token = this.tokIdentifier())||
			(token = this.tokPunctuator())
		){
			return token;
		}
		return null;
	}

	tokKeyword(){
		var regex = /^(_Static_assert|_Thread_local|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|restrict|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn)/;
		var matched = regex.exec(this.dataStr);
		if(matched){
			this.dataStr = this.dataStr.substr(matched[0].length);
			return {
				type: 'keyword',
				value: matched[0]
			};
		}else{
			return null;
		}
	}

	tokIdentifier(){
		var regex = /^(\\u[\dA-Fa-f]{4}|\\U[\dA-Fa-f]{8}|[_A-Za-z])(\\u[\dA-Fa-f]{4}|\\U[\dA-Fa-f]{8}|\w)*/;
		var matched = regex.exec(this.dataStr);
		if(matched){
			this.dataStr = this.dataStr.substr(matched[0].length);
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

	tokFloat(){
		var regex = /^(0[xX](\.[\wA-Fa-f]+|[\wA-Fa-f]+\.?[\wA-Fa-f]*)[pP][\+\-]?\w+|((\.\d+|\d+\.\d*)([eE][\+\-]?\d+)?|\d+[eE][\+\-]?\d+))[flFL]?/;
		var matched = regex.exec(this.dataStr);
		if(matched){
			this.dataStr = this.dataStr.substr(matched[0].length);
			var val = 0.0;
			var double = true;
			if(matched[0].startsWith("0x") || matched[0].startsWith("0X")){
				// hexadecimal
				var hexadecimal = matched[2].split(".");
				val += parseInt(hexadecimal[0], 16);
				if(hexadecimal[1]){
					for(var i = 0; i < hexadecimal[1].length; ++i){
						val += parseInt(hexadecimal[1].charAt(i), 16) * Math.pow(0.0625,i+1);
					}
				}
				if(matched[0].split(/[pP]/)[1]){
					val *= Math.pow(2, parseInt(matched[0].split(/[pP]/)[1]));
				}
			}else{
				// decimal
				var decimal = matched[0].split(/[eE]/);
				val += parseFloat(decimal[0]);
				if(decimal[1]){
					val *= Math.pow(10, parseInt(decimal[1]));
				}
			}
			// Suffix
			if(matched[0].endsWith('f') || matched[0].endsWith('F')){
				double = false;
			}
			return {
				type: 'floating',
				value: val,
				double: double
			};
		}else{
			return null;
		}
	}

	tokInteger(){
		var regex = /^(0x[\dA-Fa-f]+|0[0-7]*|\d+)([uU]?(ll|LL|[lL])?[uU]?)?/;
		var matched = regex.exec(this.dataStr);
		if(matched){
			this.dataStr = this.dataStr.substr(matched[0].length);
			var val = 0;
			var size = 4;
			var unsigned = false;
			if(matched[0].startsWith("0x") || matched[0].startsWith("0X")){
				// hexadecimal
				if(matched[1]){
					val = parseInt(matched[1], 16);
				}
			}else if(matched[0].startsWith("0")){
				// octal
				if(matched[1]){
					val = parseInt(matched[1], 8);
				}
			}else{
				// decimal
				if(matched[1]){
					val = parseInt(matched[1]);
				}
			}
			// Suffix
			if(matched[2]){
				if(matched[2].search('u') != -1 || matched[2].search('U') != -1){
					unsigned = true;
				}
				if(matched[2].search('ll') != -1 || matched[2].search('LL') != -1){
					size = 8;
				}
			}
			return {
				type: 'integer',
				value: val,
				unsigned: unsigned,
				size: size
			};
		}else{
			return null;
		}
	}

	tokCharacter(){
		var regex = /^(u|U|L)?\'(\\\'|[^\"\n])*\'/;
		var matched = regex.exec(this.dataStr);
		if(matched){
			regex = /^(\\(x[\dA-Fa-f]+|u[\dA-Fa-f]{4}|U[\dA-Fa-f]{8}|[0-7]{1,3}|[\'\"\?\\abfnrtv])|[\w!\;<#=%>&\?\'\[\(\)\]\*\^\+\,\{-\|\.\}\/~\:])/;
			this.dataStr = this.dataStr.substr(matched[0].length);
			var str = "";
			var charSize = 1;
			if(matched[0].startsWith("u") || matched[0].startsWith("L")){
				// UTF-16 string
				str = matched[0].substr(2, matched[0].length - 3);
				charSize = 2;
			}else if(matched[0].startsWith("U")){
				// UTF-32 string
				str = matched[0].substr(2, matched[0].length - 3);
				charSize = 4;
			}else{
				// Normal string
				str = matched[0].substr(1, matched[0].length - 2);
				charSize = 1;
			}
			var character = regex.exec(str);
			if(character != null){
				var newBuf = Buffer.alloc(charSize);
				character = character[0];
				var chVal = 0;
				if(character.startsWith("\\x")||character.startsWith("\\u")||character.startsWith("\\U")){
					chVal = parseInt(character.substr(2), 16);
				}else if(character.startsWith("\\")){
					chVal = parseInt(character.substr(1), 8);
				}else{
					chVal = character.charCodeAt(0);
				}
				switch(charSize){
					case 4:
						newBuf.writeUInt32LE(chVal);
					break;
					case 2:
						newBuf.writeUInt16LE(chVal);
					break;
					default:
						newBuf.writeUInt8(chVal);
					break;
				}
				return {
					type: 'character',
					value: newBuf,
					size: charSize
				};
			}
			return {
				type: 'character',
				value: Buffer.alloc(charSize),
				size: charSize
			};
		}else{
			return null;
		}
	}

	tokString(){
		var regex = /^(u8|u|U|L)?\"(\\\"|[^\"\n])*\"/;
		var matched = regex.exec(this.dataStr);
		if(matched){
			regex = /(\\(x[\dA-Fa-f]+|u[\dA-Fa-f]{4}|U[\dA-Fa-f]{8}|[0-7]{1,3}|[\'\"\?\\abfnrtv])|[\w!\;<#=%>&\?\'\[\(\)\]\*\^\+\,\{-\|\.\}\/~\:])/g;
			this.dataStr = this.dataStr.substr(matched[0].length);
			var str = "";
			var charSize = 1;
			if(matched[0].startsWith("u8")){
				// UTF-8 string
				str = matched[0].substr(3, matched[0].length - 4);
				charSize = 1;
			}else if(matched[0].startsWith("u") || matched[0].startsWith("L")){
				// UTF-16 string
				str = matched[0].substr(2, matched[0].length - 3);
				charSize = 2;
			}else if(matched[0].startsWith("U")){
				// UTF-32 string
				str = matched[0].substr(2, matched[0].length - 3);
				charSize = 4;
			}else{
				// Normal string
				str = matched[0].substr(1, matched[0].length - 2);
				charSize = 1;
			}
			var buffers = [];
			for(var character = regex.exec(str); character != null; character = regex.exec(str)){
				var newBuf = Buffer.alloc(charSize);
				character = character[0];
				var chVal = 0;
				if(character.startsWith("\\x")||character.startsWith("\\u")||character.startsWith("\\U")){
					chVal = parseInt(character.substr(2), 16);
				}else if(character.startsWith("\\")){
					chVal = parseInt(character.substr(1), 8);
				}else{
					chVal = character.charCodeAt(0);
				}
				switch(charSize){
					case 4:
						newBuf.writeUInt32LE(chVal);
					break;
					case 2:
						newBuf.writeUInt16LE(chVal);
					break;
					default:
						newBuf.writeUInt8(chVal);
					break;
				}
				buffers.push(newBuf);
			}
			return {
				type: 'string',
				value: Buffer.concat(buffers, charSize * buffers.length),
				size: charSize
			};
		}else{
			return null;
		}
	}

	tokPunctuator(){
		var regex = /^(%\:%\:|\.\.\.|>>=|<<=|\->|\+\+|\-\-|<=|>=|<<|>>|\*=|\/=|%=|\+=|\-=|##|<\:|\:>|<%|%>|%\:|==|!=|&=|\^=|&&|\|\||\|=|\[|\]|\(|\)|\{|\}|\.|&|\*|\+|\-|~|!|\/|%|<|>|\?|\:|;|=|\,|#|\^|\|)/;
		var matched = regex.exec(this.dataStr);
		if(matched){
			this.dataStr = this.dataStr.substr(matched[0].length);
			return {
				type: 'punctuator',
				value: matched[0]
			};
		}else{
			return null;
		}
	}
}
module.exports = new Lexer();
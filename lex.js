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

class Lexer extends Transform{
	constructor(option){
		super(option);
		this.dataStr = "";
	}
	_transform(data, encoding, callback){
		this.dataStr += data.toString();
		try{
			for(var token = getToken(this); token != null; token = getToken(this)){
				this.push(token);
			}
		}catch(err){
			callback(err, null);
		}
	}
	_flush(data){
		this.dataStr += data.toString();
		try{
			for(var token = getToken(this); token != null; token = getToken(this)){
				this.push(token);
			}
		}catch(err){
			callback(err, null);
		}
	}
}

function getToken(lexer){
	if(lexer.dataStr == ""){
		return null;
	}
	var character = lexer.dataStr.charAt(0);
	lexer.dataStr = lexer.dataStr.substr(1);
	return character + "\n";
}

module.exports = new Lexer();
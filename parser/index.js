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

class Parser extends Transform {
	constructor(option) {
		super(option);
		this.clean();
		this.emitter = new EventEmitter();
		this.emitter.on('parse', this._parse.bind(this));
		this.on('finish', this._unpipe);
	}
	clean() {
		this.ast = null;
		this.tokens = [];
		this.dataStr = "";
	}
	_write(data, encoding, callback) {
		this.dataStr += data.toString();
		try {
			var splited = this.dataStr.split('\n');
			try {
				for (var tokenStr = splited.shift(); splited.length > 0; tokenStr = splited.shift()) {
					if (tokenStr != "") {
						this.tokens.push(JSON.parse(tokenStr));
					}
				}
				this.dataStr = "";
			} catch (err) {
				if (splited.length == 0) {
					this.dataStr = tokenStr;
				} else {
					callback(err);
				}
			}
			callback(null);
		} catch (err) {
			callback(err);
		}
	}
	_read(){
		try{
			if (this.ast) {
				this.push(JSON.stringify(this.ast));
			} else {
				this.on('parsed', (() => {
					this.push(JSON.stringify(this.ast));
				}).bind(this));
			}
		}catch(err){
			this.emit('error', err);
		}
	}
	_unpipe(){
		var splited = this.dataStr.split('\n');
		for (var tokenStr = splited.shift(); splited.length > 0; tokenStr = splited.shift()) {
			if (tokenStr != "") {
				this.tokens.push(JSON.parse(tokenStr));
			}
		}
		this.emitter.emit('parse', this.tokens);
	}
	_parse() {
		this.ast = this.tokens;// FIXME: Test
		this.emitter.emit('parsed');
	}
}
module.exports = new Parser();
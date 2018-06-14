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

const fs = require("fs");
const Path = require("path");
const log = require("./errors")(process.cwd() + Path.sep + process.argv[2]);
const { Transform } = require('stream');

/** 前處理器
 * @extends {Transform}
 * @requires stream
 * @requires fs
 * @requires path
 * @requires errors
 * @property {String} dataStr 暫存接收到的資料
 * @property {MacroMap} macroMap 已定義的巨集
 * @property {bool} skipLine 是否要跳過下一行指令，運用在`#if`、`#else`、`#elif`
 * @property {bool} ifEnded `#if` 是否已經結束，運用在`#if`、`#endif`
 * @property {bool} countIf `#if` 的階層數
 * @property {String} outStr 要輸出的字串
 */
class Preprocessor extends Transform{
	/**
	 * 初始化、設定轉換串流並定義必要的巨集(Macro)
	 * @param {Option} option Transform Stream 的設定選項， 請參考 [Stream]{@link https://nodejs.org/api/stream.html#stream_stream}
	 */
	constructor(option){
		super(option);
		this.dataStr = "";
		/** 巨集集合，儲存所有巨集
		 * @typedef Preprocessor#MacroMap
		 * @property {Macro} __STDC__ 是否為標準的 C 編譯器，數值為"1"
		 * @property {Macro} __STDC_HOSTED__ 是否為 Hosted 的 C 編譯器，數值為"0"，
		 * @property {Macro} __STDC_VERSION__ C 語言規格的版本，數值為"201104L"
		 * @property {Macro} __DATE__ 編譯時的日期
		 * @property {Macro} __FILE__ 編譯時的檔案名稱
		 * @property {Macro} __LINE__ 編譯時的行號
		 * @property {Macro} __TIME__ 編譯時的時間
		 */
		/** 巨集物件
		 * @typedef Preprocessor#Macro
		 * @property {String} str 取代後的字串
		 * @property {Array} args 函式化巨集的參數
		 * @property {bool} va 函式化巨集是否包含可變的引數
		 */
		this.macroMap = {
			__STDC__: {str: "1", args: [], va: false},
			__STDC_HOSTED__: {str: "0", args: [], va: false},
			__STDC_VERSION__: {str: "201104L", args: [], va: false},
			__DATE__: {str: this.getDateStr(), args: [], va: false},
			__FILE__: {str: "", args: [], va: false},
			__LINE__: {str: "", args: [], va: false},
			__TIME__: {str: "", args: [], va: false}
		};
		this.skipLine = false;
		this.ifEnded = false;
		this.countIf = 0;
		this.outStr = "";
		this.on('pipe', ((src) => {
			src.on('end', (() => {
				if(this.dataStr != "" && log.hasError == false){
					this.runPP(this.dataStr,true);
					this.push(this.outStr);
				}
				this.emit('end');
			}).bind(this));
		}).bind(this));
	}

	/** 轉換串流的 _transform 函式
	 * @private
	 * @param  {Buffer} data 輸入的資料緩衝(Data Buffer)
	 * @param  {String} encoding <b>[不使用]</b> 資料編碼
	 * @param  {function} callback 回調函式。包含一個參數 `err`，如果有錯誤引入錯誤物件，否則為`undefined`
	 * @see [Stream]{@link https://nodejs.org/api/stream.html#stream_stream}
	 */
	_transform(data, encoding, callback){
		this.dataStr += data.toString();
		try{
			this.dataStr = this.runPP(this.dataStr);
			this.push(this.outStr);
			this.outStr = "";
		}catch(err){
			log.error(err);
			this.emit('error', err);
		}
	}
	out(data){
		this.outStr += data;
	}

	/** 執行前處理
	 * @private
	 * @param  {Buffer} data 輸入的資料緩衝(Data Buffer)
	 * @param  {bool} isLastChunk 表示這個資料緩衝是不是最後一個
	 */
	runPP(data, isLastChunk){
		// Replace digraph
		data = this.digraph(data);
		// Replace single line comment
		data = this.singleLineComment(data);
		// Replace multi line comment
		data = this.multiLineComment(data);
		// Process line by line
		var lineChunk = data.split('\n');
		var logicalLine = "";
		for(var chIndex = 0; chIndex < (isLastChunk ? lineChunk.length : lineChunk.length - 1); ++chIndex){
			log.addLine();
			logicalLine += lineChunk[chIndex];
			if(logicalLine.charAt(logicalLine.length - 1) == '\\'){
				logicalLine = logicalLine.substr(0, logicalLine.length - 1);
				this.out("\n");
				continue;
			}
			var regex = /\s*#(\\\n|[^\n])*/;
			if(logicalLine.search(regex) == 0){
				if(this.runElse(logicalLine) ||
					this.runEndif(logicalLine) ||
					this.runElif(logicalLine) ||
					this.skipLine ||
					this.runIf(logicalLine) ||
					this.runDefine(logicalLine) ||
					this.runInclude(logicalLine) ||
					this.runIfdef(logicalLine) ||
					this.runIfndef(logicalLine) ||
					this.runUndef(logicalLine) ||
					this.runLine(logicalLine) ||
					this.runError(logicalLine) ||
					this.runPragma(logicalLine)
				){
					this.out("\n");
				}else{
					logicalLine = logicalLine.trim().substr(1);
					this.out(this.evalMacro(logicalLine));
				}
			}else{
				if(!this.skipLine){
					this.out(this.evalMacro(logicalLine) + "\n");
				}else{
					this.out("\n");
				}
			}
			logicalLine = "";
		}
		return lineChunk.pop();
	}
	/** 執行#defined
	 * @private
	 * @param  {String} line 輸入的資料字串，表示邏輯上的一行程式碼
	 */
	runDefine(line){
		var regex = /\s*#\s*define(\s+|$)/;
		if(line.search(regex) != 0){
			return false;
		}
		line = line.substr(line.match(regex)[0].length);
		var macroName = line.match(/\w*/);
		if(!macroName){
			throw `[PP]: Expected macro name in #define directive`;
		}
		macroName = macroName[0];
		line = line.substr(macroName.length);
		var macro = {
			str: "",
			args: [],
			va: false
		};
		if(line.charAt(0) == '('){
			var paramLine = line.match(/\([^\)]*\)/);
			if(!paramLine){
				throw `[PP]: Unmatched ')' in #define directive`;
			}
			line = line.substr(paramLine[0].length);
			var params = paramLine[0].substr(1, paramLine[0].length - 2).split(',');
			params.forEach((param) => {
				if(param.trim() == "..."){
					macro.va = true;
				}else{
					var dup = false;
					macro.args.map(arg => dup = dup | arg == param.trim());
					if(dup){
						throw `[PP]: Identifier '${param.trim()}' dublicated in #define directive`;
					}
					macro.args.push(param.trim());
				}
			});
		}
		macro.str = line.substr(1);
		this.macroMap[macroName] = macro;
		return true;
	}
	/** 執行#if
	 * @private
	 * @param  {String} line 輸入的資料字串，表示邏輯上的一行程式碼
	 */
	runIf(line){
		var regex = /\s*#\s*if(\s+|$)/;
		if(line.search(regex) != 0){
			return false;
		}
		line = line.substr(line.match(regex)[0].length);
		this.countIf += 1;
		line = this.evalMacro(line, true);
		var value = this.evalExpr(line);
		if(value === null){
			return false;
		}else if(value === undefined){
			throw `[PP]: Expected expression in #if directive`;
		}
		this.skipLine = value == 0;
		return true;
	}
	/** 執行#ifdef
	 * @private
	 * @param  {String} line 輸入的資料字串，表示邏輯上的一行程式碼
	 */
	runIfdef(line){
		var regex = /\s*#\s*ifdef(\s+|$)/;
		if(line.search(regex) != 0){
			return false;
		}
		line = line.substr(line.match(regex)[0].length);
		// Get macro name
		var macro = line.match(/[_A-Za-z]\w*/);
		if(!macro){
			throw `[PP]: Expected macro name in #ifndef.`;
		}
		macro = macro[0];
		this.skipLine = this.macroMap[macro] ? false : true;
		this.countIf += 1;
		return true;
	}
	/** 執行#undef
	 * @private
	 * @param  {String} line 輸入的資料字串，表示邏輯上的一行程式碼
	 */
	runUndef(line){
		var regex = /\s*#\s*undef(\s+|$)/;
		if(line.search(regex) != 0){
			return false;
		}
		line = line.substr(line.match(regex)[0].length);
		// Get macro name
		var macro = line.match(/[_A-Za-z]\w*/);
		if(!macro){
			throw `[PP]: Expected macro name in #undef.`;
		}
		macro = macro[0];
		if(this.macroMap[macro]){
			delete this.macroMap[macro];
		}
		return true;
	}
	/** 執行#ifndef
	 * @private
	 * @param  {String} line 輸入的資料字串，表示邏輯上的一行程式碼
	 */
	runIfndef(line){
		var regex = /\s*#\s*ifndef(\s+|$)/;
		if(line.search(regex) != 0){
			return false;
		}
		line = line.substr(line.match(regex)[0].length);
		// Get macro name
		var macro = line.match(/[_A-Za-z]\w*/);
		if(!macro){
			throw `[PP]: Expected macro name in #ifdef.`;
		}
		macro = macro[0];
		this.skipLine = this.macroMap[macro] ? true : false;
		this.countIf += 1;
		return true;
	}
	/** 執行#line
	 * @private
	 * @param  {String} line 輸入的資料字串，表示邏輯上的一行程式碼
	 */
	runLine(line){
		var regex = /\s*#\s*line(\s+|$)/;
		if(line.search(regex) != 0){
			return false;
		}
		line = line.substr(line.match(regex)[0].length);
		// Get line number
		var regex = /\d+/;
		var lineNum = line.search(regex);
		if(!(lineNum == 0)){
			line = this.evalMacro(line);
			lineNum = line.search(regex);
			if(!(lineNum == 0)){
				throw `[PP]: Expected line number in #line.`;
			}
		}
		lineNum = parseInt(line.match(regex)[0]);
		if(isNaN(lineNum)){
			throw `[PP]: Invalid line number in #line.`;
		}
		log.line = lineNum;
		line = line.substr(line.match(regex)[0].length);
		// Get file name (optional)
		var fileName = line.match(/\"[^\"\n]+\"/);
		if(fileName){
			fileName = fileName[0].substr(1, fileName[0].length - 2);
			log.fileName = fileName;
		}

		return true;
	}
	/** 執行#elif
	 * @private
	 * @param  {String} line 輸入的資料字串，表示邏輯上的一行程式碼
	 */
	runElif(line){
		var regex = /\s*#\s*elif(\s+|$)/;
		if(line.search(regex) != 0){
			return false;
		}
		if(this.countIf <= 0){
			throw `[PP]: #elif without #if.`;
		}else if(this.skipLine){
			if(!this.ifEnded){
				line = line.substr(line.match(regex)[0].length);
				line = this.evalMacro(line, true);
				var value = this.evalExpr(line);
				if(value === null){
					return false;
				}else if(value === undefined){
					throw `[PP]: Expected expression in #elif directive`;
				}
				this.skipLine = value == 0;
			}
		}else{
			this.skipLine = true;
			this.ifEnded = true;
		}
		return true;
	}
	/** 執行#else
	 * @private
	 * @param  {String} line 輸入的資料字串，表示邏輯上的一行程式碼
	 */
	runElse(line){
		var regex = /\s*#\s*else(\s+|$)/;
		if(line.search(regex) != 0){
			return false;
		}
		if(!this.ifEnded){
			this.skipLine = !this.skipLine;
		}
		if(this.countIf <= 0){
			throw `[PP]: #else without #if.`;
		}
		return true;
	}
	/** 執行#include
	 * @private
	 * @param  {String} line 輸入的資料字串，表示邏輯上的一行程式碼
	 */
	runInclude(line){
		var regex = /\s*#\s*include(\s*|$)/;
		if(line.search(regex) != 0){
			return false;
		}
		line = line.substr(line.match(regex)[0].length);
		// Get file path
		var filePath = line.match(/(\"[^\n\"]+\"|<[^\n>]+>)/);
		if(!filePath){
			filePath = this.evalMacro(line).match(/(\"[^\n\"]+\"|<[^\n>]+>)/);
			if(!filePath){
				throw `[PP]: Expected file path in #include directive`;
			}
		}
		filePath = filePath[0];
		if(filePath.charAt(0) == "\""){
			filePath = fs.existsSync(Path.resolve(Path.dirname(log.fileName), filePath.substr(1, filePath.length - 2))) ? Path.resolve(Path.dirname(log.fileName), filePath.substr(1, filePath.length - 2)) : filePath;
		}
		if(filePath.charAt(0) == "\"" || filePath.charAt(0) == "<"){
			filePath = fs.existsSync(Path.resolve(__dirname, "include", filePath.substr(1, filePath.length - 2))) ? Path.resolve(__dirname, "include", filePath.substr(1, filePath.length - 2)) : filePath;
			if(filePath.charAt(0) == "\"" || filePath.charAt(0) == "<"){
				throw `[PP]: Included file ${filePath} not found`;
			}
		}
		// Get file content
		try{
			var fileData = fs.readFileSync(filePath);
			var oldLine = log.line;
			var oldFile = log.fileName;
			log.line = 0;
			log.fileName = filePath;
			this.out(`# 1 "${filePath}"\n`);
			// Process included data
			var remain = this.runPP(fileData.toString(), true);
			log.line = oldLine;
			log.fileName = oldFile;
			this.out(`# ${oldLine} "${oldFile}"\n`);
		}catch(err){
			throw `[PP]: File ${filePath} including error: ${err}`;
		}
		return true;
	}
	/** 執行#endif
	 * @private
	 * @param  {String} line 輸入的資料字串，表示邏輯上的一行程式碼
	 */
	runEndif(line){
		var regex = /\s*#\s*endif(\s+|$)/;
		if(line.search(regex) != 0){
			return false;
		}
		this.skipLine = false;
		this.ifEnded = false;
		if(this.countIf <= 0){
			throw `[PP]: #endif without #if.`;
		}
		this.countIf -= 1;
		return true;
	}
	/** 執行#pragma
	 * @private
	 * @param  {String} line 輸入的資料字串，表示邏輯上的一行程式碼
	 */
	runPragma(line){
		var regex = /\s*#\s*pragma(\s+|$)/;
		if(line.search(regex) != 0){
			return false;
		}
		return true;
	}
	/** 執行#error
	 * @private
	 * @param  {String} line 輸入的資料字串，表示邏輯上的一行程式碼
	 */
	runError(line){
		line = line.trim();
		var regex = /\s*#\s*error(\s+|$)/;
		if(line.search(regex) != 0){
			return false;
		}
		line = line.substr(line.match(regex)[0].length);
		throw `[PP]: ${line}`;
	}
	evalMacro(line, evalDefined, argList){
		var modified = false;
		do{
			// Replace args
			if(argList){
				line = this.replaceArgs(line,argList);
			}
			// Eval defined
			if(evalDefined){
				line = this.defined(line);
			}
			// Skip pragma
			line = this.pragma(line);
			// Eval macro
			var regex = /(\"(\\\"|[^\"\n])*\"|\'(\\\'|[^\'\n])*\'|[A-Za-z_]\w*(\s*\(.*?\))?)/g;
			var processing = line.substr();
			line = "";
			var preLastIndex = 0;
			modified = false;
			for(var matched = regex.exec(processing); matched != null; matched = regex.exec(processing)){
				// String literal
				if(matched[0].startsWith("\"") || matched[0].startsWith("\'")){
					line += processing.substr(preLastIndex, regex.lastIndex - preLastIndex);
					preLastIndex = regex.lastIndex;
					continue;
				}
				// Update __FILE__, __LINE__, __TIME__
				const curDate = new Date();
				this.macroMap.__FILE__.str = `"${log.fileName}"`;
				this.macroMap.__LINE__.str = log.line.toString();
				this.macroMap.__TIME__.str = `"${curDate.getHours() < 10 ? "0" + curDate.getHours() : curDate.getHours()}:${curDate.getMinutes() < 10 ? "0" + curDate.getMinutes() : curDate.getMinutes()}:${curDate.getSeconds() < 10 ? "0" + curDate.getSeconds() : curDate.getSeconds()}"`;
				// Macro
				var macroName = matched[0].match(/[A-Za-z_]\w*/)[0];
				var paramStr = matched[0].match(/\s*\(.*\)$/);
				paramStr = paramStr ? this.evalMacro(paramStr[0], this.macroMap, null) : "";
				if(this.macroMap[macroName]){
					var macro = this.macroMap[macroName];
					if(macro.va || macro.args.length > 0){
						// Split args
						var argArray = paramStr.trim().substr(1, paramStr.trim().length - 2).match(/(\"(\\\"|[^\"])*\"|[^,]*)*(,|\s*$)/g)
							.map(arg => arg.charAt(arg.length - 1) == ',' ? arg.substr(0, arg.length - 1) : arg);
						argArray.pop();
						// Generate argument list
						var newArgList = {
							__VA_ARGS__:""
						};
						argArray.forEach((arg, index) => {
							if(index < macro.args.length){
								newArgList[macro.args[index]] = arg;
							}else{
								if(macro.va){
									if(newArgList.__VA_ARGS__ != ""){
										newArgList.__VA_ARGS__ += ',';
									}
									newArgList.__VA_ARGS__ += arg;
								}else{
									throw `[PP]: Too more arguments in function-like macro ${matched[0]}`;
								}
							}
						});
						// Write to line
						var expanded = this.evalMacro(macro.str, evalDefined, newArgList);
						expanded = this.hashhash(expanded);
						line += processing.substr(preLastIndex, regex.lastIndex - matched[0].length - preLastIndex) + expanded;
						preLastIndex = regex.lastIndex;
					}else{
						// Replace macro
						var leading = processing.substr(preLastIndex, regex.lastIndex - matched[0].length - preLastIndex);
						var expanded = this.evalMacro(macro.str, evalDefined, newArgList);
						expanded = this.hashhash(expanded);
						if(/([^#]|^)#\s*$/.test(leading)){
							leading = leading.replace(/([^#]|^)#\s*$/,"");
							line += leading + "\"" + expanded + "\"" + paramStr;
						}else{
							line += leading + expanded + paramStr;
						}
						preLastIndex = regex.lastIndex;
					}
					modified = true;
				}
			}
			line += processing.substr(preLastIndex);
		}while(modified);
		return line;
	}
	defined(line){
		var regex = /(\"(\\\"|[^\"\n])*\"|\'(\\\'|[^\'\n])*\'|defined\s*(\(\s*\w+\s*\)|\w+\s*))/g;
		var preLastIndex = 0;
		var processing = line.substr();
		line = "";
		for(var matched = regex.exec(processing); matched != null; matched = regex.exec(processing)){
			// String literal
			if(matched[0].startsWith("\"") || matched[0].startsWith("\'")){
				line += processing.substr(preLastIndex, regex.lastIndex - preLastIndex);
				preLastIndex = regex.lastIndex;
				continue;
			}
			var macroName = matched[0].substr(7).match(/[A-Za-z_]\w*/)[0];
			if(this.macroMap[macroName]){
				line += processing.substr(preLastIndex, regex.lastIndex - matched[0].length - preLastIndex) + " 1 ";
			}else{
				line += processing.substr(preLastIndex, regex.lastIndex - matched[0].length - preLastIndex) + " 0 ";
			}
			preLastIndex = regex.lastIndex;
		}
		line += processing.substr(preLastIndex);
		return line;
	}
	pragma(line){
		var regex = /(\"(\\\"|[^\"\n])*\"|\'(\\\'|[^\'\n])*\'|_Pragma\s*\(\s*\"[^\"\n]*\"\s*\))/g;
		var preLastIndex = 0;
		var processing = line.substr();
		line = "";
		for(var matched = regex.exec(processing); matched != null; matched = regex.exec(processing)){
			// String literal
			if(matched[0].startsWith("\"") || matched[0].startsWith("\'")){
				line += processing.substr(preLastIndex, regex.lastIndex - preLastIndex);
				preLastIndex = regex.lastIndex;
				continue;
			}
			line += processing.substr(preLastIndex, regex.lastIndex - matched[0].length - preLastIndex);
			preLastIndex = regex.lastIndex;
		}
		line += processing.substr(preLastIndex);
		return line;
	}
	hashhash(line){
		var regex = /(\"(\\\"|[^\"\n])*\"|\'(\\\'|[^\'\n])*\'|\s*##\s*)/g;
		var preLastIndex = 0;
		var processing = line.substr();
		line = "";
		for(var matched = regex.exec(processing); matched != null; matched = regex.exec(processing)){
			// String literal
			if(matched[0].startsWith("\"") || matched[0].startsWith("\'")){
				line += processing.substr(preLastIndex, regex.lastIndex - preLastIndex);
				preLastIndex = regex.lastIndex;
				continue;
			}
			line += processing.substr(preLastIndex, regex.lastIndex - matched[0].length - preLastIndex);
			preLastIndex = regex.lastIndex;
		}
		line += processing.substr(preLastIndex);
		return line;
	}
	digraph(data){
		var regex = /(\"(\\\"|[^\"\n])*\"|(<\:|\:>|<%|%>|%\:))/g;
		var preLastIndex = 0;
		var processing = data.substr();
		data = "";
		for(var matched = regex.exec(processing); matched != null; matched = regex.exec(processing)){
			// String literal
			if(matched[0].startsWith("\"")){
				data += processing.substr(preLastIndex, regex.lastIndex - preLastIndex);
				preLastIndex = regex.lastIndex;
				continue;
			}
			var replaced = "";
			if(matched[0] == "<:"){
				replaced = "[";
			}else if(matched[0] == ":>"){
				replaced = "]";
			}else if(matched[0] == "<%"){
				replaced = "{";
			}else if(matched[0] == "%>"){
				replaced = "}";
			}else{
				replaced = "#";
			}
			data += processing.substr(preLastIndex, regex.lastIndex - 2 - preLastIndex) + replaced;
			preLastIndex = regex.lastIndex;
		}
		data += processing.substr(preLastIndex);
		return data;
	}
	replaceArgs(line, argList){
		var regex = /(\"(\\\"|[^\"\n])*\"|\'(\\\'|[^\'\n])*\'|[A-Za-z_]\w*)/g;
		var preLastIndex = 0;
		var processing = line.substr();
		line = "";
		for(var matched = regex.exec(processing); matched != null; matched = regex.exec(processing)){
			// String literal
			if(matched[0].startsWith("\"") || matched[0].startsWith("\'")){
				line += processing.substr(preLastIndex, regex.lastIndex - preLastIndex);
				preLastIndex = regex.lastIndex;
				continue;
			}
			if(argList[matched[0]]){
				// Replace macro
				var leading = processing.substr(preLastIndex, regex.lastIndex - matched[0].length - preLastIndex);
				if(/([^#]|^)#\s*$/.test(leading)){
					leading = leading.replace(/([^#]|^)#\s*$/,"");
					line += leading + "\"" + argList[matched[0]] + "\"";
				}else{
					line += leading + argList[matched[0]];
				}
			}else{
				line += processing.substr(preLastIndex, regex.lastIndex - preLastIndex);
			}
			preLastIndex = regex.lastIndex;
		}
		line += processing.substr(preLastIndex);
		return line;
	}
	singleLineComment(data){
		var regex = /(\"(\\\"|[^\"\n])*\"|\/\/[^\n]*\n)/g;
		var preLastIndex = 0;
		var processing = data.substr();
		data = "";
		for(var matched = regex.exec(processing); matched != null; matched = regex.exec(processing)){
			// String literal
			if(matched[0].startsWith("\"")){
				data += processing.substr(preLastIndex, regex.lastIndex - preLastIndex);
				preLastIndex = regex.lastIndex;
				continue;
			}
			data += processing.substr(preLastIndex, regex.lastIndex - matched[0].length - preLastIndex) + "\n";
			preLastIndex = regex.lastIndex;
		}
		data += processing.substr(preLastIndex);
		return data;
	}
	multiLineComment(data){
		var regex = /(\"(\\\"|[^\"\n])*\"|\/\*([^\*]|\*[^\/])*\*\/)/g;
		var preLastIndex = 0;
		var processing = data.substr();
		data = "";
		for(var matched = regex.exec(processing); matched != null; matched = regex.exec(processing)){
			// String literal
			if(matched[0].startsWith("\"")){
				data += processing.substr(preLastIndex, regex.lastIndex - preLastIndex);
				preLastIndex = regex.lastIndex;
				continue;
			}
			data += processing.substr(preLastIndex, regex.lastIndex - matched[0].length - preLastIndex) + matched[0].replace(/[^\n]/g,"");
			preLastIndex = regex.lastIndex;
		}
		data += processing.substr(preLastIndex);
		return data;
	}
	evalExpr(line){
		var integerRegex = /(0[xX][\dA-Fa-f]*|0[1-7]*|[1-9]\d*)([uU](ll|LL|[lL])?|(ll|LL|[lL])[uU]?)?/;
		var floatRegex = /(0[xX](\.[\dA-Fa-f]+|[\dA-Fa-f]+.[\dA-Fa-f]*)[pP][+-]?\d+|((\.\d+|\d+\.\d*)([eE][+-]?\d+)?|\d+[eE][+-]?\d+))[fFlL]?/;
		var charRegex = /[LuU]?\'(\\([\\\'\"\?\w]|[0-7]{1,3}|x[\dA-Fa-f]+|[uU][\dA-Fa-f]{4}([\dA-Fa-f]{4})?)|[\w!;<#=%>&\?\[\(\/~\:\*\^\+\],\{\-\|\.\}])*\'/;
		var punctRegex = /(\|\||&&|!=|==|<<|>>|<=|>=|[\^\|&<>\+\-\*\/%!~\(\)])/;
		var identRegex = /(\\u[\dA-Fa-f]{4}|\\U[\dA-Fa-f]{8}|[A-Za-z_])(\\u[\dA-Fa-f]{4}|\\U[\dA-Fa-f]{8}|\w)*/;
		var expr = "";
		while((line = line.trim()) != ""){
			if(line.search(floatRegex) == 0){
				var str = floatRegex.exec(line)[0];
				throw `[PP]: Floating number in preprocessor integer constant expression.`;
			}else if(line.search(integerRegex) == 0){
				var str = integerRegex.exec(line)[0];
				var val = 0;
				if(str.startsWith("0x") || str.startsWith("0X")){
					val = Number.parseInt(str, 16);
				}else if(str.startsWith("0")){
					val = Number.parseInt(str, 8);
				}else{
					val = Number.parseInt(str, 10);
				}
				expr += val.toString();
				line = line.substr(str.length);
			}else if(line.search(charRegex) == 0){
				var str = charRegex.exec(line)[0];
				var oriLen = str.length;
				str = str.match(/'.*'/)[0];
				str = str.substr(1, str.length - 2);
				if(str.startsWith("\\0")){
					expr += Number.parseInt(str.substr(1),8).toString();
				}else if(str.startsWith("\\x")){
					expr += Number.parseInt(str.substr(2),16).toString();
				}else if(str.startsWith("\\u") || str.startsWith("\\U")){
					expr += str.substr(2);
				}else if(str.startsWith("\\")){
					switch(str.charAt(1)){
						case '\'':
						case '\"':
						case '\\':
						case '\?':
							expr += str.charCodeAt(1).toString();
						break;
						case 'a':
							expr += "7";
						break;
						case 'b':
							expr += "8";
						break;
						case 'f':
							expr += "12";
						break;
						case 'n':
							expr += "10";
						break;
						case 'r':
							expr += "13";
						break;
						case 't':
							expr += "9";
						break;
						case 'v':
							expr += "11";
						break;
						default:
							throw `[PP]: Unknown escape character in preprocessor integer constant expression.`;
					}
				}else{
					expr += str.charCodeAt(0).toString();
				}
				line = line.substr(oriLen);
			}else if(line.search(punctRegex) == 0){
				var str = punctRegex.exec(line)[0];
				expr += str;
				line = line.substr(str.length);
			}else if(line.search(identRegex) == 0){
				var str = identRegex.exec(line)[0];
				expr += "0";
				line = line.substr(str.length);
			}else{
				throw `[PP]: Invalid token in preprocessor integer constant expression.`;
			}
		}
		try{
			return eval(expr);
		}catch(err){
			throw `[PP]: Invalid expression in preprocessor integer constant expression.`;
		}
	}
	getDateStr(){
		const curDate = new Date();
		var ret = "\"";
		switch(curDate.getMonth()){
			case 0:
				ret += "Jan ";
			break;
			case 1:
				ret += "Feb ";
			break;
			case 2:
				ret += "Mar ";
			break;
			case 3:
				ret += "Apr ";
			break;
			case 4:
				ret += "May ";
			break;
			case 5:
				ret += "Jun ";
			break;
			case 6:
				ret += "Jul ";
			break;
			case 7:
				ret += "Aug ";
			break;
			case 8:
				ret += "Sep ";
			break;
			case 9:
				ret += "Oct ";
			break;
			case 10:
				ret += "Nov ";
			break;
			default:
				ret += "Dec ";
			break;
		}
		ret += curDate.getDate();
		ret += " " + curDate.getFullYear() + "\"";
		return ret;
	}
}

module.exports = new Preprocessor();
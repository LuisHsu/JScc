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
const log = require("./errors")(Path.join(process.cwd(),process.argv[2]));

var remainBuf = Buffer.alloc(0);

const fin = fs.createReadStream(process.argv[2]);
const fout = fs.createWriteStream(process.argv[3]);

var macroMap = {
	__STDC__: {str: "1", args: [], va: false},
	__STDC_HOSTED__: {str: "0", args: [], va: false},
	__STDC_VERSION__: {str: "201104L", args: [], va: false},
	__DATE__: {str: getDateStr(), args: [], va: false},
	__FILE__: {str: "", args: [], va: false},
	__LINE__: {str: "", args: [], va: false},
	__TIME__: {str: "", args: [], va: false}
};
var skipLine = false;
var ifEnded = false;
var countIf = 0;

fin.on('data', (data) => {
	var dataBuf = Buffer.concat([remainBuf, data], remainBuf.length + data.length);
	var remain = runPP(dataBuf.toString());
	remainBuf = Buffer.from(remain);
});

fin.on('end', () => {
	if(remainBuf.length > 0){
		runPP(remainBuf.toString(), true);
	}
	if(log.hasError){
		process.exitCode = -1;
		fout.close();
		fs.unlink(process.argv[3],(err) => {});
	}
});

function runPP(data, isLastChunk){
	// Replace digraph
	data = digraph(data);
	// Replace single line comment
	data = singleLineComment(data);
	// Replace multi line comment
	data = multiLineComment(data);
	// Process line by line
	var lineChunk = data.split('\n');
	var logicalLine = "";
	for(var chIndex = 0; chIndex < (isLastChunk ? lineChunk.length : lineChunk.length - 1); ++chIndex){
		log.addLine();
		logicalLine += lineChunk[chIndex];
		if(logicalLine.charAt(logicalLine.length - 1) == '\\'){
			logicalLine = logicalLine.substr(0, logicalLine.length - 1);
			fout.write("\n");
			continue;
		}
		var regex = /\s*#(\\\n|[^\n])*/;
		if(logicalLine.search(regex) == 0){
			if(runElse(logicalLine) ||
				runEndif(logicalLine) ||
				runElif(logicalLine) ||
				skipLine ||
				runIf(logicalLine) ||
				runDefine(logicalLine) ||
				runInclude(logicalLine) ||
				runIfdef(logicalLine) ||
				runIfndef(logicalLine) ||
				runUndef(logicalLine) ||
				runLine(logicalLine) ||
				runError(logicalLine) ||
				runPragma(logicalLine)
			){
				fout.write("\n");
			}else{
				logicalLine = logicalLine.trim().substr(1);
				fout.write(evalMacro(logicalLine));
			}
		}else{
			if(!skipLine){
				fout.write(evalMacro(logicalLine) + "\n");
			}else{
				fout.write("\n");
			}
		}
		logicalLine = "";
	}
	return lineChunk.pop();
}

function runDefine(line){
	var regex = /\s*#\s*define(\s+|$)/;
	if(line.search(regex) != 0){
		return false;
	}
	line = line.substr(line.match(regex)[0].length);
	var macroName = line.match(/\w*/);
	if(!macroName){
		log.error(`[PP]: Expected macro name in #define directive`);
		return false;
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
			log.error(`[PP]: Unmatched ')' in #define directive`);
			return false;
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
					log.error(`[PP]: Identifier '${param.trim()}' dublicated in #define directive`);
					return false;
				}
				macro.args.push(param.trim());
			}
		});
	}
	macro.str = line.substr(1);
	macroMap[macroName] = macro;
	return true;
}

function runIf(line){
	var regex = /\s*#\s*if(\s+|$)/;
	if(line.search(regex) != 0){
		return false;
	}
	line = line.substr(line.match(regex)[0].length);
	countIf += 1;
	line = evalMacro(line, true);
	var value = evalExpr(line);
	if(value === null){
		return false;
	}else if(value === undefined){
		log.error(`[PP]: Expected expression in #if directive`);
		return false;
	}
	skipLine = value == 0;
	return true;
}

function runIfdef(line){
	var regex = /\s*#\s*ifdef(\s+|$)/;
	if(line.search(regex) != 0){
		return false;
	}
	line = line.substr(line.match(regex)[0].length);
	// Get macro name
	var macro = line.match(/[_A-Za-z]\w*/);
	if(!macro){
		log.error(`[PP]: Expected macro name in #ifndef.`);
		return false;
	}
	macro = macro[0];
	skipLine = macroMap[macro] ? false : true;
	countIf += 1;
	return true;
}

function runUndef(line){
	var regex = /\s*#\s*undef(\s+|$)/;
	if(line.search(regex) != 0){
		return false;
	}
	line = line.substr(line.match(regex)[0].length);
	// Get macro name
	var macro = line.match(/[_A-Za-z]\w*/);
	if(!macro){
		log.error(`[PP]: Expected macro name in #undef.`);
		return false;
	}
	macro = macro[0];
	if(macroMap[macro]){
		delete macroMap[macro];
	}
	return true;
}

function runIfndef(line){
	var regex = /\s*#\s*ifndef(\s+|$)/;
	if(line.search(regex) != 0){
		return false;
	}
	line = line.substr(line.match(regex)[0].length);
	// Get macro name
	var macro = line.match(/[_A-Za-z]\w*/);
	if(!macro){
		log.error(`[PP]: Expected macro name in #ifdef.`);
		return false;
	}
	macro = macro[0];
	skipLine = macroMap[macro] ? true : false;
	countIf += 1;
	return true;
}

function runLine(line){
	var regex = /\s*#\s*line(\s+|$)/;
	if(line.search(regex) != 0){
		return false;
	}
	line = line.substr(line.match(regex)[0].length);
	// Get line number
	var regex = /\d+/;
	var lineNum = line.search(regex);
	if(!(lineNum == 0)){
		line = evalMacro(line);
		lineNum = line.search(regex);
		if(!(lineNum == 0)){
			log.error(`[PP]: Expected line number in #line.`);
			return false;
		}
	}
	lineNum = parseInt(line.match(regex)[0]);
	if(isNaN(lineNum)){
		log.error(`[PP]: Invalid line number in #line.`);
		return false;
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

function runElif(line){
	var regex = /\s*#\s*elif(\s+|$)/;
	if(line.search(regex) != 0){
		return false;
	}
	if(countIf <= 0){
		log.error(`[PP]: #elif without #if.`);
		return false;
	}else if(skipLine){
		if(!ifEnded){
			line = line.substr(line.match(regex)[0].length);
			line = evalMacro(line, true);
			var value = evalExpr(line);
			if(value === null){
				return false;
			}else if(value === undefined){
				log.error(`[PP]: Expected expression in #elif directive`);
				return false;
			}
			skipLine = value == 0;
		}
	}else{
		skipLine = true;
		ifEnded = true;
	}
	return true;
}

function runElse(line){
	var regex = /\s*#\s*else(\s+|$)/;
	if(line.search(regex) != 0){
		return false;
	}
	if(!ifEnded){
		skipLine = !skipLine;
	}
	if(countIf <= 0){
		log.error(`[PP]: #else without #if.`);
		return false;
	}
	return true;
}

function runInclude(line){
	var regex = /\s*#\s*include(\s*|$)/;
	if(line.search(regex) != 0){
		return false;
	}
	line = line.substr(line.match(regex)[0].length);
	// Get file path
	var filePath = line.match(/(\"[^\n\"]+\"|<[^\n>]+>)/);
	if(!filePath){
		filePath = evalMacro(line).match(/(\"[^\n\"]+\"|<[^\n>]+>)/);
		if(!filePath){
			log.error(`[PP]: Expected file path in #include directive`);
			return false;
		}
	}
	filePath = filePath[0];
	if(filePath.charAt(0) == "\""){
		filePath = fs.existsSync(Path.resolve(Path.dirname(log.fileName), filePath.substr(1, filePath.length - 2))) ? Path.resolve(Path.dirname(log.fileName), filePath.substr(1, filePath.length - 2)) : filePath;
	}
	if(filePath.charAt(0) == "\"" || filePath.charAt(0) == "<"){
		filePath = fs.existsSync(Path.resolve(__dirname, "include", filePath.substr(1, filePath.length - 2))) ? Path.resolve(__dirname, "include", filePath.substr(1, filePath.length - 2)) : filePath;
		if(filePath.charAt(0) == "\"" || filePath.charAt(0) == "<"){
			log.error(`[PP]: Included file ${filePath} not found`);
			return false;
		}
	}
	// Get file content
	try{
		var fileData = fs.readFileSync(filePath);
		var oldLine = log.line;
		var oldFile = log.fileName;
		log.line = 0;
		log.fileName = filePath;
		fout.write(`# 1 "${filePath}"\n`);
		// Process included data
		var remain = runPP(fileData.toString(), true);
		log.line = oldLine;
		log.fileName = oldFile;
		fout.write(`# ${oldLine} "${oldFile}"\n`);
	}catch(err){
		log.error(`[PP]: File ${filePath} including error: ${err}`);
		return false;
	}
	return true;
}

function runEndif(line){
	var regex = /\s*#\s*endif(\s+|$)/;
	if(line.search(regex) != 0){
		return false;
	}
	skipLine = false;
	startIf = false;
	ifEnded = false;
	if(countIf <= 0){
		log.error(`[PP]: #endif without #if.`);
		return false;
	}
	countIf -= 1;
	return true;
}

function runPragma(line){
	var regex = /\s*#\s*pragma(\s+|$)/;
	if(line.search(regex) != 0){
		return false;
	}
	return true;
}

function runError(line){
	line = line.trim();
	var regex = /\s*#\s*error(\s+|$)/;
	if(line.search(regex) != 0){
		return false;
	}
	line = line.substr(line.match(regex)[0].length);
	log.error(`[PP]: ${line}`);

	return true;
}

function evalMacro(line, evalDefined, argList){
	var modified = false;
	do{
		// Replace args
		if(argList){
			line = replaceArgs(line,argList);
		}
		// Eval defined
		if(evalDefined){
			line = defined(line);
		}
		// Skip pragma
		line = pragma(line);
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
			macroMap.__FILE__.str = `"${log.fileName}"`;
			macroMap.__LINE__.str = log.line.toString();
			macroMap.__TIME__.str = `"${curDate.getHours() < 10 ? "0" + curDate.getHours() : curDate.getHours()}:${curDate.getMinutes() < 10 ? "0" + curDate.getMinutes() : curDate.getMinutes()}:${curDate.getSeconds() < 10 ? "0" + curDate.getSeconds() : curDate.getSeconds()}"`;
			// Macro
			var macroName = matched[0].match(/[A-Za-z_]\w*/)[0];
			var paramStr = matched[0].match(/\s*\(.*\)$/);
			paramStr = paramStr ? evalMacro(paramStr[0], macroMap, null) : "";
			if(macroMap[macroName]){
				var macro = macroMap[macroName];
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
								log.error(`[PP]: Too more arguments in function-like macro ${matched[0]}`);
								return line;
							}
						}
					});
					// Write to line
					var expanded = evalMacro(macro.str, evalDefined, newArgList);
					expanded = hashhash(expanded);
					line += processing.substr(preLastIndex, regex.lastIndex - matched[0].length - preLastIndex) + expanded;
					preLastIndex = regex.lastIndex;
				}else{
					// Replace macro
					var leading = processing.substr(preLastIndex, regex.lastIndex - matched[0].length - preLastIndex);
					var expanded = evalMacro(macro.str, evalDefined, newArgList);
					expanded = hashhash(expanded);
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

function defined(line){
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
		if(macroMap[macroName]){
			line += processing.substr(preLastIndex, regex.lastIndex - matched[0].length - preLastIndex) + " 1 ";
		}else{
			line += processing.substr(preLastIndex, regex.lastIndex - matched[0].length - preLastIndex) + " 0 ";
		}
		preLastIndex = regex.lastIndex;
	}
	line += processing.substr(preLastIndex);
	return line;
}

function pragma(line){
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

function hashhash(line){
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

function digraph(data){
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

function replaceArgs(line, argList){
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

function singleLineComment(data){
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

function multiLineComment(data){
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

function evalExpr(line){
	var integerRegex = /(0[xX][\dA-Fa-f]*|0[1-7]*|[1-9]\d*)([uU](ll|LL|[lL])?|(ll|LL|[lL])[uU]?)?/;
	var floatRegex = /(0[xX](\.[\dA-Fa-f]+|[\dA-Fa-f]+.[\dA-Fa-f]*)[pP][+-]?\d+|((\.\d+|\d+\.\d*)([eE][+-]?\d+)?|\d+[eE][+-]?\d+))[fFlL]?/;
	var charRegex = /[LuU]?\'(\\([\\\'\"\?\w]|[0-7]{1,3}|x[\dA-Fa-f]+|[uU][\dA-Fa-f]{4}([\dA-Fa-f]{4})?)|[\w!;<#=%>&\?\[\(\/~\:\*\^\+\],\{\-\|\.\}])*\'/;
	var punctRegex = /(\|\||&&|!=|==|<<|>>|<=|>=|[\^\|&<>\+\-\*\/%!~\(\)])/;
	var identRegex = /(\\[uU][\dA-Fa-f]{4}([\dA-Fa-f]{4})?|[A-Za-z_])(\\[uU][\dA-Fa-f]{4}([\dA-Fa-f]{4})?|\w)*/;
	var expr = "";
	while((line = line.trim()) != ""){
		if(line.search(floatRegex) == 0){
			var str = floatRegex.exec(line)[0];
			log.error(`[PP]: Floating number in preprocessor integer constant expression.`);
			return null;
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
						log.error(`[PP]: Unknown escape character in preprocessor integer constant expression.`);
					return null;
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
			log.error(`[PP]: Invalid token in preprocessor integer constant expression.`);
			return null;
		}
	}
	try{
		return eval(expr);
	}catch(err){
		log.error(`[PP]: Invalid expression in preprocessor integer constant expression.`);
		return null;
	}
}

function getDateStr(){
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
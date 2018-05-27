module.exports = {
	getToken: (expect, tokens) => {
		if(tokens[0].type == 'keyword' || tokens[0].type == 'punctuator'){
			return tokens[0].value == expect ? tokens.shift() : null;
		}else{
			return tokens[0].type == expect ? tokens.shift() : null;
		}
	}
};
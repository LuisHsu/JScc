module.exports = {
	getToken: (expect, tokens) => {
		if(tokens.cursor >= tokens.length){
			return null;
		}
		if(tokens[tokens.cursor].type == 'keyword' || tokens[tokens.cursor].type == 'punctuator'){
			return tokens[tokens.cursor].value == expect ? tokens[tokens.cursor++] : null;
		}else{
			return tokens[tokens.cursor].type == expect ? tokens[tokens.cursor++] : null;
		}
	}
};
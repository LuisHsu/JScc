
class ParseError {
	constructor(context, input){
		this.message = 'ParseError';
	}
}

module.exports = (context, input) => {
	return new ParseError(context, input);
};
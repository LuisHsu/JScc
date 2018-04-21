const fs = require("fs");
const Path = require("path");

module.exports.cleanTmp = () => {
	fs.unlink(Path.resolve(process.cwd(),"tmp.E"), (err) => {
	});
};
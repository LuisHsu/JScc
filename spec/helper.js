const fs = require("fs");
const child_process = require("child_process");

module.exports.cleanTmp = () => {
	fs.unlink("tmp.E", (err) => {
	});
};
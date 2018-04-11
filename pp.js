import fs from "fs";

var tmpbuf = Buffer.alloc(0)

fs.readFile(process.argv[2], (err, data) => {
	var dataBuf = Buffer.concat([tmpbuf, data], tmpbuf.length + data.length);
	console.log(dataBuf.toString);
	tmpbuf = dataBuf;
})
const express  = require('express');
const app = express();

app.use(express.static('doc'));

app.get('/', (req, res) => {
    res.redirect("index.html");
});

app.listen(3000, () => {
    console.log("JSCC document server run on port 3000");
});
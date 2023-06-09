const browserify = require('browserify');
const fs = require("fs");
const b = browserify();
b.add('./index.js');
b.require('./index.js', { expose: './TekstowoAPI' });
if (!fs.existsSync("./dist"))
    fs.mkdirSync("./dist");
b.bundle().pipe(fs.createWriteStream("./dist/TekstowoAPI-browser.js"));

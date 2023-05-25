const browserify = require('browserify');
const fs = require("fs");
const b = browserify();
b.add('./index.js');
fs.mkdirSync("./dist");
b.bundle().pipe(fs.createWriteStream("./dist/TekstowoAPI-browser.js"));

const mdLinks = require('./index');
const fs = require("fs");
let args = process.argv.slice(2);

if (args.length === 0) {
  throw "no hay argumentos";
}

let filePath = args[0];
if (!fs.existsSync(filePath)) {
  throw "Invalid path";
}

let options = args.slice(1);
let validate = options.indexOf("--validate") > -1;
let stats = options.indexOf("--stats") > -1;

mdLinks(filePath, { validate: validate }).then(result => {
  if (!stats) {
    result.forEach(l => {
      if (!validate) {
        console.log(`${l.file} ${l.href} ${l.text}`);
      } else {
        console.log(
          `${l.file} ${l.href} ${l.ok ? "ok" : "fail"} ${l.status} ${l.text}`
        );
      }
    });
  } else {
    let total = result.length;
    console.log(`Total: ${total} `);
    let links = {};

    result.forEach(l => {
      links[l.href] = l.href;
    });
    let unique = Object.keys(links).length;
    console.log(`Unique: ${unique}`);
    if (validate) {
      let broken = result.filter(l => !l.ok).length;
      console.log(`Broken: ${broken}`);
    }
  }
});



const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = async function mdLinks(inputPath, options) {
  if (!fs.existsSync(inputPath)) {
    throw 'Invalid path';
  }

  let isDir = fs.lstatSync(inputPath).isDirectory();

  if (!isDir && !isMdFile(inputPath)) {
    throw 'Invalid file extension';
  }

  let fileList;
  if (isDir) {
    fileList = getAllFiles(inputPath).filter(f => isMdFile(f));
  } else {
    fileList = [inputPath];
  }

  let linkInfoResults = fileList.flatMap(fileName => {
    let fileContent = fs.readFileSync(fileName, 'utf8');
    let fileResult = checkFiles(fileContent, fileName);
    return fileResult;
  });

  if (typeof options !== 'undefined' && options && options.validate) {
    let resultPromiseArray = linkInfoResults.map(linkInfo => {
      let validationPromise = validateLink(linkInfo);
      let validatedLinkInfo = validationPromise
        .then(validationResult => {
          // destructuring
          ({ href, text, file } = linkInfo);
          return {
            href, // igual que href: href
            text,
            file,
            status: validationResult.status,
            ok: validationResult.ok,
          };
        })
        .catch();

      return validatedLinkInfo;
    });

    // resuelve todas las promesas del arreglo y resuelve a un arreglo con los valores
    return Promise.all(resultPromiseArray);
  } else {
    return linkInfoResults;
  }
};

function checkFiles(fileContent, fileName) {
  let linkRegex = /\[(.+)\]\((\S*)\)/g;

  let matches = fileContent.match(linkRegex);
  if (!matches) {
    return [];
  }

  let linkInfoResults = matches.map(m => {
    let execResult = /\[(.+)\]\((\S*)\)/g.exec(m);
    let linkInfo = {
      href: execResult[2],
      text: execResult[1],
      file: fileName,
    };

    return linkInfo;
  });

  return linkInfoResults;
}

// sacado de gist
function getAllFiles(dir, fileList) {
  fileList = fileList || [];
  let files = fs.readdirSync(dir);
  files.forEach(function(file) {
    let filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileList = getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function isMdFile(file) {
  return /\.md$/i.test(file);
}

function validateLink(linkInfo) {
  return axios
    .get(linkInfo.href)
    .then(response => {
      let validationResult = {
        status: response.status,
        ok: true,
      };
      return validationResult;
    })
    .catch(error => {
      let validationResult = {
        status: !error.response ? null : error.response.status,
        ok: false,
      };
      return validationResult;
    });
}

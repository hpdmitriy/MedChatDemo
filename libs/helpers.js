const fs = require('fs');
const md5 = require('md5');
const ASSISTANTS = ['admin', 'assistant', 'manager'];
const {indexOf} = require('lodash');

const readFile = (path, opts = 'utf8') =>
  new Promise((res, rej) => {
    fs.readFile(path, opts, (err, data) => {
      if (err) rej(err);
      else res(data)
    })
  });
const unlinkFile = (path) =>
  new Promise((res, rej) => {
    fs.unlink(path, (err) => {
      if (err) rej(err);
      else res(path)
    })
  });

const readDir = (path, opts = 'utf8') =>
  new Promise((res, rej) => {
    fs.readdir(path, opts, (err, data) => {
      if (err) rej(err);
      else res(data)
    })
  });
const mkDir = (path, mode) =>
  new Promise((res, rej) => {
    fs.mkdir(path, mode, (err, data) => {
      if (err) rej(err);
      else res(data)
    })
  });
const removeDir = (path) =>
  new Promise((res, rej) => {
    fs.rmdir(path, (err) => {
      if (err) rej(err);
      else res(path)
    })
  });
const lStat = (path) =>
  new Promise((res, rej) => {
    fs.lstat(path, (err, data) => {
      if (err) res(null);
      else res(data)
    })
  });

const writeFile = (path, data, opts = 'utf8') =>
  new Promise((res, rej) => {
    fs.writeFile(path, data, opts, (err) => {
      if (err) rej(err);
      else res()
    })
  });

const updateFile = (file, msg, id = 0) =>
  new Promise((res, rej) => {
    fs.open(file, "a", (err, fd) => {
      if (err) {
        rej(err);
        throw 'could not open file: ' + err;
      }
      setTimeout(() => {
        fs.write(fd, `${msg}`, null, 'utf8', function (err) {
          if (err) {
            rej(err);
            throw 'error writing file: ' + err;
          }
          fs.close(fd, function () {
            res();
            console.log(`added => ${id}`);
          });
        });
      }, 10)
    });
  });
function uid() {
  return Math.random().toString(36).slice(2);
}

function isAssistant(role) {
  return indexOf(ASSISTANTS, role) >= 0;
}

module.exports = {
  readFile,
  writeFile,
  readDir,
  updateFile,
  lStat,
  mkDir,
  uid,
  isAssistant,
  removeDir,
  unlinkFile
};

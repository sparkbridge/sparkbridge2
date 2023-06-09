const fs = require('fs');


function exists(pt) {
    try {
        return fs.existsSync(pt);
    } catch { }
}

function writeTo(pt, raw) {
    try {
        fs.writeFileSync(pt, raw);
    } catch { }
}

function mkdir(pt) {
    try {
        fs.mkdirSync(pt);
    } catch { }
}

function copy(pt, npt) {
    try {
        fs.copyFileSync(pt, npt);
    } catch { }
}

function read(pt) {
    try {
        return fs.readFileSync(pt);
    } catch { }
}

function listdir(pt) {
    try {
        return fs.readdirSync(pt);
    } catch { }
}

module.exports = {
    exists, writeTo, mkdir, copy, read, listdir
}
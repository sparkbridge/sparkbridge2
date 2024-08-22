const fs = require('fs');
var PLUGIN_DATA_DIR;
if (typeof mc !== 'undefined') {
    if (!exists('./plugins/LeviLamina')) {
        PLUGIN_DATA_DIR = './plugins/nodejs/sparkbridge2/serverdata'
    }
    else {
        PLUGIN_DATA_DIR = './plugins/sparkbridge2/serverdata'
    }
} else {
    PLUGIN_DATA_DIR = './testdata'
}


const JSON5 = require('json5');
class FileObj {
    pname;
    constructor(plugin_name) {
        this.pname = plugin_name;
        if (exists(PLUGIN_DATA_DIR + '/' + this.pname) == false) {
            mkdir(PLUGIN_DATA_DIR + '/' + this.pname);
        }
    }
    initFile(fname, init_obj, json = JSON) {
        if (exists(PLUGIN_DATA_DIR + '/' + this.pname + '/' + fname) == false)
            writeTo(PLUGIN_DATA_DIR + '/' + this.pname + '/' + fname, json.stringify(init_obj, null, 4));
    }
    getFile(fname) {
        if (exists(PLUGIN_DATA_DIR + '/' + this.pname) == false) {
            return null;
        } else {
            return read(PLUGIN_DATA_DIR + '/' + this.pname + '/' + fname)
        }
    }
    getBuffer(fname) {
        if (exists(PLUGIN_DATA_DIR + '/' + this.pname) == false) {
            return null;
        } else {
            return fs.readFileSync(PLUGIN_DATA_DIR + '/' + this.pname + '/' + fname)
        }
    }
    updateFile(fname, data_obj, json = JSON) {
        writeTo(PLUGIN_DATA_DIR + '/' + this.pname + '/' + fname, json.stringify(data_obj, null, 4));
    }
}



function exists(pt) {
    try {
        return fs.existsSync(pt);
    } catch (e) { console.log(e) }
}

function writeTo(pt, raw) {
    try {
        fs.writeFileSync(pt, raw, { encoding: 'utf-8' });
    } catch (e) { console.log(e) }
}

function mkdir(pt) {
    try {
        fs.mkdirSync(pt);
    } catch (e) { console.log(e) }
}

function copy(pt, npt) {
    try {
        fs.copyFileSync(pt, npt);
    } catch (e) { console.log(e) }
}

function read(pt) {
    try {
        return fs.readFileSync(pt, { encoding: 'utf-8' });
    } catch (e) { console.log(e) }
}

function listdir(pt) {
    try {
        return fs.readdirSync(pt);
    } catch (e) { console.log(e) }
}

module.exports = {
    exists, writeTo, mkdir, copy, read, listdir, FileObj
}
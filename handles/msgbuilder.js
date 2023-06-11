const fs = require('fs');
const fhelper = require('./file')
class Builder {
    static img(file) {
        if (typeof file === 'string' && fhelper.exists(file)) file = fs.readFileSync(file)
        if (file instanceof Buffer) file = `base64://${file.toString('base64')}`
        return { type: 'image', data: { file: file, subType: 0 } }
    }
    static at(qid) {
        return { type: "at", data: { "qq": qid } };

    }
    static text(raw) {
        return { type: 'text', data: { text: raw } };
    }
}


module.exports = Builder;
const fs = require('fs');
const fhelper = require('./file')
class Builder {
    static img(file) {
        if (typeof file === 'string' && fhelper.exists(file)) file = fs.readFileSync(file);
        if (file instanceof Buffer) file = `base64://${file.toString('base64')}`;
        return { type: 'image', data: { file: file, subType: 0 } }
    }
    static at(qid) {
        return { type: "at", data: { "qq": qid } };
    }
    static face(id) {
        return { type: 'face', data: { id } }
    }
    static text(raw) {
        return { type: 'text', data: { text: raw } };
    }
    static poke(id) {
        return { type: 'poke', data: { qq: id } }
    }
    static reply(id) {
        return { type: 'reply', data: { id } };
    }
    static format(msg) {
        if (Array.isArray(msg) == false) {
            msg = [msg];
        }
        for (let index in msg) {
            var imsg = msg[index];
            if (typeof imsg == 'string') {
                msg[index] = Builder.text(imsg);
            }
        }
        if (spark.debug) console.log('build msg -->' + JSON.stringify(msg))
        return msg;
    }
}


module.exports = Builder;
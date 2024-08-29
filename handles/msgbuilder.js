const fs = require('fs');
const fhelper = require('./file');

class ForwardMsgBuilder {
    msg = [];
    addMsgById(id) {
        this.msg.push({
            type: 'node',
            data: {
                id
            }
        });
    }
    addCustomsMsg(name, uin, content) {
        this.msg.push({
            type: 'node',
            data: {
                name,
                uin,
                content
            }
        });
    }
    getMsg() {
        return this.msg;
    }
}

class Builder {
    static img(file) {
        if (typeof file === 'string' && fhelper.exists(file)) file = fs.readFileSync(file);
        if (file instanceof Buffer) file = `base64://${file.toString('base64')}`;
        return { type: 'image', data: { file: file, subType: 0 } };
    }
    static at(qid) {
        qid = qid.toString();
        return { type: "at", data: { "qq": qid } };
    }
    static face(id) {
        id = id.toString();
        return { type: 'face', data: { id } };
    }
    static text(raw) {
        return { type: 'text', data: { text: raw } };
    }
    static poke(id) {
        id = id.toString();
        return { type: 'poke', data: { qq: id } };
    }
    static video(file) {
        file = file.toString();
        return { type: 'video', data: { file: file } };
    }
    static record(file) {
        file = file.toString();
        return { type: "record", data: { file: file } };
    }
    static reply(id) {
        id = id.toString();
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
        if (spark.debug) console.log('build msg -->' + JSON.stringify(msg));
        return msg;
    }
    static ForwardMsgBuilder() {
        return new ForwardMsgBuilder();
    }
}


module.exports = Builder;

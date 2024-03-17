//var CQstr = '[CQ:reply,text=Hello World,qq=10086,time=3376656000,seq=5123]';

function parseCode(codeStr) {
    let data = { type: "", data: {} }
    let code = codeStr.slice(0).slice(1, -1).split(',');
    let index = 1;
    code.forEach(element => {
        if (index === 1) {
            data.type = element.split(':')[1];
        } else {
            data.data[element.split('=')[0]] = element.split('=')[1];
        }
        index++;
    });
    return data;
}

function parseCQString(codeStr) {
    let inCode = false;

    let currentCode = '';
    let currentText = '';

    let totalCode = [];
    for (var i in codeStr) {
        var currentChar = codeStr[i];
        if (currentChar === '[') {
            inCode = true;
            if (currentText !== '') {
                totalCode.push({ type: "text", data: { text: currentText } });
                currentText = '';
            }
        }
        if (inCode) {
            currentCode += currentChar;
            if (currentChar === ']' && inCode) {
                inCode = false;
                totalCode.push(parseCode(currentCode));
                currentCode = '';
            }
        } else {
            currentText += currentChar;
        }
    }

    if (currentText !== '') {
        totalCode.push({ type: "text", data: { text: currentText } });
    }
    if (spark.debug) console.log('parsing -->', codeStr, 'result -->', totalCode);
    return totalCode;
}


module.exports = {
    parseCode,
    parseCQString
}
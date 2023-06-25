const _config = spark.getFileHelper('economy');
_config.initFile('config.json', {
    moneyType: 0 // 0 LLMoney  1 local
});
_config.initFile('data.json', {});

const config = JSON.parse(_config.getFile('config.json'));
const dat = JSON.parse(_config.getFile("data.json"));

function HasXbox(qid) {
    if (spark.mc.getXbox(qid) == undefined) {
        return false;
    } else {
        return true;
    }
}

function c_save() {
    _config.updateFile('data.json', dat);
}

function c_add(qid, c) {
    dta[qid] += c;
    c_save()
}

function c_rem(qid, c) {
    dta[qid] -= c;
    c_save()
}

function c_get(qid) {
    if (dat[qid] == undefined) dat[qid] = 0;
    return dat[qid];
}

function getMoney(qid) {
    if (config.moneyType == 0) {
        if (HasXbox(qid)) {
            let xuid = data.name2xuid(spark.mc.getXbox(qid));
            return { success: true, result: money.get(xuid) };
        } else {
            return { success: false };
        }
    } else {
        return { success: true, result: c_get(qid) };
    }
}

function remMoney(qid, count) {
    if (config.moneyType == 0) {
        if (HasXbox(qid)) {
            let xuid = data.name2xuid(spark.mc.getXbox(qid));
            return { success: money.reduce(xuid,count)};
        } else {
            return { success: false };
        }
    } else {
        let has = c_get(qid);
        if(has >= count){
            c_rem(qid,count);
            return {success:true};
        }else{
            return {success :false};
        }
    }
}

function addMoney(qid, count) {
    if (config.moneyType == 0) {
        if(HasXbox(qid)){
            let xuid = data.name2xuid(spark.mc.getXbox(qid));
            return { success: money.add(xuid,count)};
        }
    } else {
        c_add(qid,count);
        return {success:true};
    }
}

spark.economy = {
    addMoney,remMoney,getMoney
}
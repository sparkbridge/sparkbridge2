class WebConfigTye{
    static EditArray  = 1;
    static switch = 2;
    static Choosing = 3;
    static text = 4;
    static number = 5;
    static buttom = 6;
}


class WebConfigBuilder{
    plname;
    configObj = {};
    constructor(plname){
        this.plname = plname;
    }
    addEditArray(k,v,desc = "描述"){
       this.#setKV(k,v,WebConfigTye.EditArray,desc);
    }
    addChoosing(k,opt,v,desc = "描述"){
        if(this.configObj[k]){
            throw new Error(`plugin ${this.plname} add a already key (${k}) when build web config`);
        }
        this.configObj[k] = {
            type: WebConfigTye.Choosing,
            value: v,
            options: opt,
            desc
        }
    }
    addSwitch(k,v,desc = "描述"){
        this.#setKV(k,v,WebConfigTye.switch,desc);
    }
    addText(k,v,desc = "描述"){
        this.#setKV(k,v,WebConfigTye.text,desc);
    }
    addNumber(k,v,desc = "描述"){
        this.#setKV(k,v,WebConfigTye.number,desc);
    }
    addButtom(k,v,desc = "描述"){
        this.#setKV(k, v, WebConfigTye.buttom, desc);
    }
    #setKV(k,v,t,desc){
        if(this.configObj[k]){
            throw new Error(`plugin ${this.plname} add a already key (${k}) when build web config`);
        }
        this.configObj[k] = {
            type: t,
            value: v,
            desc
        }
    }
}

module.exports = {WebConfigTye,WebConfigBuilder};
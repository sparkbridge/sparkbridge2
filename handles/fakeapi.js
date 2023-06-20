global.mc={};

mc.listen = (evk,func) =>{
    console.log('监听：'+evk);
}

mc.runcmd = (cmd) =>{
    console.log('执行：'+cmd);
}

mc.runcmdEx = (cmd) =>{
    console.log('执行：'+cmd);
    return {output:'执行成功',success:true}
}


mc.broadcast = (msg) =>{
    console.log('广播：'+msg);
}
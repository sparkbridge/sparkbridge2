global.mc = {};
global.ll = {};

ll.exports = (fnc,name) =>{
    console.log('共享：'+name +'=>'+ fnc.name);
}

mc.listen = (evk, func) => {
    console.log('监听：' + evk);
}

mc.runcmd = (cmd) => {
    console.log('执行：' + cmd);
}

mc.runcmdEx = (cmd) => {
    console.log('执行：' + cmd);
    return { output: '执行成功：fakeapi completed', success: true }
}


mc.broadcast = (msg) => {
    console.log('广播：' + msg);
}
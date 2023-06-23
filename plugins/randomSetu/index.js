// https://t.mwm.moe/moe/
// https://api.lolicon.app/setu/v2?r18=1

const msgbuilder = require('../../handles/msgbuilder');
const axios = require("axios").default;
const _config = spark.getFileHelper('randomSetu');
_config.initFile('config.json',{
    r18:2,
    msg:'1为开启，2为关闭'
});
const config = JSON.parse(_config.getFile('config.json'));

spark.on('message.group.normal', (e, reply) => {
    if (e.group_id == spark.mc.config.group && e.raw_message == '色图') {
        var url = 'https://api.lolicon.app/setu/v2?r18='+config.r18;
        axios(url).then(res=>{
            reply(msgbuilder.img(res.data['data'][0]['urls']['original'])).then(e => {
                setTimeout(()=>{
                    spark.QClient.deleteMsg(e.message_id);
                },5e3);
            }).catch(e=>{
                console.log(e);
            })
        }).catch((e)=>{
            reply('图片获取失败了');
            console.log(e);
        })
    }
})
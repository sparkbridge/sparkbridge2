const msgbuilder = require('../../handles/msgbuilder');
spark.QClient.on('bot.online', () => {
    spark.QClient.sendGroupMsg(spark.mc.config.group, msgbuilder.img('https://s1.ax1x.com/2023/04/11/ppqjoo8.md.jpg'));
});

spark.on('message.group.normal', (e, reply) => {
    const { raw_message } = e;
    if (raw_message == '土豆')
        reply(msgbuilder.img('https://s1.ax1x.com/2023/04/11/ppqjoo8.md.jpg'))
})
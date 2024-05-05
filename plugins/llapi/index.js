function SendMsg(msg) {
    spark.QClient.sendGroupMsg(spark.mc.config.group, msg);
}
ll.export(SendMsg, "SparkAPI", "sendGroupMessage");
function SendMsg(msg) {
    spark.QClient.sendGroupMsg(group, msg);
}
ll.export(SendMsg, "SparkAPI", "sendGroupMessage");
const winston = require('winston');

class SparkLogger{
    logger;
    constructor(plugin_name){
        this.logger = winston.createLogger({
            format: winston.format.printf((info) => {
                return `${today.format("YYYY-MM-DD h:mm:ss")} [${info.level}] ${plugin_name} | ${info.message}`
            }),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: data_file_path == null ? `./plugins/sparkbridge/logs/${today.format("YYYY-MM-DD")}.log` : data_file_path+'logs/${today.format("YYYY-MM-DD")}.log' })
            ]
        });
    }
}
const winston = require('winston');
const dayjs = require('dayjs');
const today = dayjs();

function SparkLogger(plugin_name){
    return winston.createLogger({
        format: winston.format.printf((info) => {
            return `${today.format("YYYY-MM-DD h:mm:ss")} [${info.level}] ${plugin_name} | ${info.message}`
        }),
        transports: [
            new winston.transports.Console()
            //new winston.transports.File({ filename:  `./plugins/sparkbridge2/logs/${today.format("YYYY-MM-DD")}-${}.log` })
        ]
    });
}
module.exports ={ getLogger:SparkLogger};
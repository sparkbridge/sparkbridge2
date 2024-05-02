const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const dayjs = require('dayjs');
const today = dayjs();

const myFormat = printf(({ level, message, label}) => {
    return `${dayjs().format("YYYY-MM-DD HH:mm:ss")} [${label}] [${ level}] ${message}`;
  });

function SparkLogger(plugin_name){
    return createLogger({
        format: combine(
            label({ label: plugin_name}),
            myFormat
          ),
        transports: [
            new transports.Console()
            //new winston.transports.File({ filename:  `./plugins/sparkbridge2/logs/${today.format("YYYY-MM-DD")}-${}.log` })
        ]
    });
}
module.exports ={ getLogger:SparkLogger};
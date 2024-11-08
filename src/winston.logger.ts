import { createLogger, format, transports } from "winston";

const customFormat = format.printf(({timestamp, level, stack, message}) => {
  return `${timestamp} - [${level.toUpperCase().padEnd(7)}] - ${stack || message}`
})

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const day = new Date().getDate();
const today = year+'-'+month+'-'+day;

const options = {
  file: {
    filename: `logs/${today}/error.log`,
    level: 'error'
  },
  info: {
    filename: `logs/${today}/info.log`,
    level: 'info'
  },
  warn: {
    filename: `logs/${today}/warn.log`,
    level: 'warn'
  },
  console: {
    level: 'silly'
  }
}

// For development and test environment
const devLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({stack: true}),
    customFormat
  ),
  transports: [new transports.Console(options.console)]
}

// For production environment
const prodLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({stack: true}),
    format.json()
  ),
  transports: [
    new transports.File(options.file),
    new transports.File(options.info),
    new transports.File(options.warn),
  ]
}

const instanceLogger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export const winLogInstance = createLogger(instanceLogger);

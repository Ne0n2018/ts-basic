import { createLogger, transports, format, Logger } from 'winston';

const logger: Logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf((info) => {
      const { timestamp, level, message } = info as {
        timestamp?: string;
        level: string;
        message: string;
      };
      return `${timestamp ?? 'No timestamp'} ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: './logs/errors.log', level: 'error' }),
    new transports.File({ filename: './logs/all.log', maxsize: 5242880, level: 'info' }),
  ],
});

export default logger;

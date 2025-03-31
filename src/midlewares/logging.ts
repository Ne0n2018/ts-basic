import { fileURLToPath } from 'url';
import path from 'path';
import { NextFunction, Request, Response } from 'express';
import Stream from 'stream';
import util from 'util';
import fs from 'fs';
import config from '../common/config';

const pipeline = util.promisify(Stream.pipeline);
const { PORT } = config;

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const logging = (req: Request, res: Response, next: NextFunction): void => {
  const requestTime = new Date();
  const logsFolder = path.join(dirname, '../../logs');

  if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder);
  }

  (async (): Promise<void> => {
    try {
      const processTime = Date.now() - requestTime.getTime();
      const logMessage = `
    request Time:     ${requestTime.toDateString()}
    method:           ${req.method}
    url:              http://localhost:${PORT}${req.baseUrl + req.url}
    body:             ${JSON.stringify(req.body)}
    query:            ${JSON.stringify(req.query)}
    params:           ${JSON.stringify(req.params)}
    processing time:  ${processTime} ms
    status code:      ${res.statusCode}\n`;

      await pipeline(
        Stream.Readable.from(logMessage),
        fs.createWriteStream(path.join(logsFolder, 'logging.txt'), { flags: 'a' })
      );
    } catch (err) {
      console.error('Ошибка при записи логов:', err);
    }
  })().catch((err) => console.error('Ошибка в асинхронной операции:', err));

  next();
};

import { NextFunction, Request, Response } from 'express';
import Stream from 'stream';
import util from 'util';
import path from 'path';
import fs from 'fs';
import config from '../common/config';

const pipeline = util.promisify(Stream.pipeline);
const { PORT } = config;

export const logging = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const requestTime = new Date();
  const processTime = Date.now() - +requestTime;
  const logsFolder = path.join(__dirname, '../../logs');

  if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder);
  }

  try {
    await pipeline(
      Stream.Readable.from(`
    request Time:     ${requestTime.toDateString()}
    method:           ${req.method}
    url:              ${`http://localhost:${PORT}${req.baseUrl + req.url}`}
    body:             ${JSON.stringify(req.body)}
    query:            ${JSON.stringify(req.query)}
    params:           ${JSON.stringify(req.params)}
    processing time:  ${processTime} ms
    status code:      ${res.statusCode}\n`),
      fs.createWriteStream(path.join(__dirname, '../../logs/logging.txt'), { flags: 'a' })
    );
  } catch (err) {
    if (err instanceof Error) {
      process.stderr.write(`${err.message}\n`);
    } else {
      process.stderr.write('An unknown error occurred.\n');
    }
    process.exit(1);
  }
  next();
};

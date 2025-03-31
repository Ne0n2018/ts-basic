import { Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import stream from 'stream';
import util from 'util';

const pipeline = util.promisify(stream.pipeline);

// Определение __dirname для ES-модулей
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const errorHandling = (error: Error, _req: Request, res: Response): Response => {
  const { name, message, stack } = error;
  const statusCode = name === 'Error' ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR;
  const messageReason = getReasonPhrase(statusCode);
  const logsFolder = path.join(dirname, '../../logs');

  if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder);
  }

  // Асинхронная операция с явной обработкой ошибок
  (async (): Promise<void> => {
    try {
      const logMessage = `
      status code:     ${statusCode}
      errorName:       ${name}
      errorMessage:    ${message}
      errorStack:      ${stack}\n
      `;
      await pipeline(
        stream.Readable.from(logMessage),
        fs.createWriteStream(path.join(logsFolder, 'errorHandling.txt'), {
          flags: 'a',
        })
      );
    } catch (err) {
      console.error('Ошибка записи логов:', err instanceof Error ? err.message : err);
    }
  })().catch((err) => console.error('Ошибка в асинхронной операции:', err));

  // Возвращение ответа клиенту
  return res.status(statusCode).json({ statusCode, messageReason });
};

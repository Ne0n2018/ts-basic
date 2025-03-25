import express, { Express, Request, Response } from 'express';

import scheduleRouter from './resources/schedule/schedule.router';
import priceRouter from './resources/price/price.router';
import tourRouter from './resources/tour/tour.router';

const app: Express = express();

app.use(express.json());

app.use('/', (req: Request, res: Response, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/tours', tourRouter);
app.use('/schedules', scheduleRouter);
app.use('/prices', priceRouter);

export default app;

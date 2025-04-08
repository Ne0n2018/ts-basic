import express, { Express, Request, Response } from 'express';
import { errorHttpLogger, errorLogger, notFound, successHttpLogger } from 'middlewares';
import userRoute from './resources/user/user.route';
import postRoute from './resources/post/post.router';
import commentRoute from './resources/comment/comment.route';

const app: Express = express();

app.use(express.json());

app.use('/', (req: Request, res: Response, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});
app.use(successHttpLogger);
app.use(errorHttpLogger);
app.use('/user', userRoute);
app.use('/post', postRoute);
app.use('/comment', commentRoute);
app.use(notFound);
app.use(errorLogger);
export default app;

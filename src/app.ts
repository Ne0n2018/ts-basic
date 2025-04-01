import express, { Express, Request, Response } from 'express';
import { errorHttpLogger, errorLogger, notFound, successHttpLogger } from 'middlewares';
import userRouter from './resources/user/user.router';
import postRouter from './resources/post/post.router';
import commentRouter from './resources/comment/comment.router';

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

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

app.use(notFound);
app.use(errorLogger);
export default app;

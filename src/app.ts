import express, { Express, NextFunction, Request, Response } from 'express';
import { errorHttpLogger, errorLogger, notFound, successHttpLogger } from 'middlewares';
import swaggerSpec from 'swagger';
import swaggerUi from 'swagger-ui-express';
import { authMiddleware } from 'middlewares/auth';
import userRoute from './resources/user/user.route';
import postRoute from './resources/post/post.router';
import commentRoute from './resources/comment/comment.route';
import adminRoute from './resources/admin/admin.route';

const app: Express = express();

app.use(express.json());

app.use('/', (req: Request, res: Response, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api-docs' && !req.url.endsWith('/')) {
    res.redirect('/api-docs/');
    return;
  }
  next();
});
app.use(successHttpLogger);
app.use(errorHttpLogger);
app.use('/user', authMiddleware, userRoute);
app.use('/post', postRoute);
app.use('/comment', commentRoute);
app.use('/admin', adminRoute);
app.use(notFound);
app.use(errorLogger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: Error, _req: Request, res: Response, next: NextFunction): void => {
  if (res.headersSent) {
    next(err);
  }
});

export default app;

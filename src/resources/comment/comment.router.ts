import express, { Router } from 'express';
import { asyncHandler } from 'common/asyncHandler';

import { CommentRequestBody, CommentRequestParams } from 'types/express';
import * as commentControl from './comment.controller';

const router: Router = express.Router();

router.get('/', asyncHandler(commentControl.getAll));
router.get('/:commentId', asyncHandler<CommentRequestParams>(commentControl.getById));

router.post('/', asyncHandler<void, void, CommentRequestBody>(commentControl.create));

router.put(
  '/:commentId',
  asyncHandler<CommentRequestParams, void, CommentRequestBody>(commentControl.update)
);

router.delete('/:commentId', asyncHandler<CommentRequestParams>(commentControl.deleteComment));

export default router;

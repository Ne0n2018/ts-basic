import express, { Router } from 'express';
import { asyncHandler } from 'common/asyncHandler';
import { PostRequestBody, PostRequestParams } from 'types/express';
import * as postControl from './post.controller';

const router: Router = express.Router();

router.get('/', asyncHandler(postControl.getAll));
router.get('/:postId', asyncHandler<PostRequestParams>(postControl.getById));

router.post('/', asyncHandler<void, void, PostRequestBody>(postControl.create));

router.put('/:postId', asyncHandler<PostRequestParams, void, PostRequestBody>(postControl.update));

router.delete('/:postId', asyncHandler<PostRequestParams>(postControl.deletePost));

export default router;

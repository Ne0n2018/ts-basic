import express, { Router } from 'express';
import { asyncHandler } from 'common/asyncHandler';
import { UserRequestBody, UserRequestParams } from 'types/express';
import * as userControll from './user.controller';

const router: Router = express.Router();
router.get('/', asyncHandler(userControll.getAll));
router.post('/', asyncHandler<void, void, UserRequestBody>(userControll.create));
router.get('/:userId', asyncHandler<UserRequestParams>(userControll.getById));
router.put('/:userId', asyncHandler<UserRequestParams, void, UserRequestBody>(userControll.update));
router.delete('/:userId', asyncHandler<UserRequestParams>(userControll.deleteById));

export default router;

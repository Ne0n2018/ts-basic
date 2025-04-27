// src/routes/admin.routes.ts

import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { adminService } from './admin.service';

const router = express.Router();

interface CreateAdminInput {
  Name: string;
  Password: string;
}

interface LoginInput {
  Name: string;
  Password: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         Id:
 *           type: string
 *           description: The auto-generated ID of the admin
 *         Name:
 *           type: string
 *           description: The name of the admin
 *         Password:
 *           type: string
 *           description: The hashed password of the admin
 *         CreatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the admin was created
 *         UpdatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the admin was last updated
 *       required:
 *         - Id
 *         - Name
 *         - Password
 *         - CreatedAt
 *         - UpdatedAt
 *     CreateAdminInput:
 *       type: object
 *       properties:
 *         Name:
 *           type: string
 *           description: The name of the admin
 *         Password:
 *           type: string
 *           description: The password of the admin
 *       required:
 *         - Name
 *         - Password
 *     LoginInput:
 *       type: object
 *       properties:
 *         Name:
 *           type: string
 *           description: The name of the admin
 *         Password:
 *           type: string
 *           description: The password of the admin
 *       required:
 *         - Name
 *         - Password
 */

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAdminInput'
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Admin with this name already exists
 */
router.post(
  '/register',
  [
    body('Name').isString().notEmpty().withMessage('Name must be a non-empty string'),
    body('Password').isString().notEmpty().withMessage('Password must be a non-empty string'),
  ],
  asyncHandler(async (req: Request<object, unknown, CreateAdminInput>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { Name, Password } = req.body;

    // Проверяем, существует ли администратор с таким именем
    const existingAdmin = await adminService.getAdminByName(Name);
    if (existingAdmin) {
      res.status(409).json({ error: 'Admin with this name already exists' });
      return;
    }

    const newAdmin = await adminService.createAdmin({ Name, Password });
    res.status(201).json(newAdmin);
  })
);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Login an admin and get a JWT token
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  [
    body('Name').isString().notEmpty().withMessage('Name must be a non-empty string'),
    body('Password').isString().notEmpty().withMessage('Password must be a non-empty string'),
  ],
  asyncHandler(async (req: Request<object, unknown, LoginInput>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { Name, Password } = req.body;

    const admin = await adminService.getAdminByName(Name);
    if (!admin) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await adminService.verifyPassword(admin, Password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = await adminService.generateToken(admin);
    await adminService.saveToken(admin.Id, token);

    res.status(200).json({ token });
  })
);

/**
 * @swagger
 * /admin/logout:
 *   post:
 *     summary: Logout an admin by invalidating the JWT token
 *     tags: [Admin]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.post(
  '/logout',
  asyncHandler(
    async (
      req: Request & { admin?: { id: string; name: string; role: string } },
      res: Response
    ) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(401).json({ error: 'Unauthorized - Missing token' });
        return;
      }

      await adminService.deleteToken(token);
      res.status(200).json({ message: 'Logout successful' });
    }
  )
);

export default router;

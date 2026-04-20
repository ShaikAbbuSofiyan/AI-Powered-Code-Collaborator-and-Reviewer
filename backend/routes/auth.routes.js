import express from 'express';
import { getUser, Login, Register } from '../controllers/auth.controller.js';
import {isUserAuth} from '../middleware/auth.middleware.js'

const authRouter = express.Router();

// @route   POST api/auth/register
authRouter.post('/register', Register);

// @route   POST api/auth/login
authRouter.post('/login', Login);

authRouter.get('/getUser', isUserAuth, getUser)


export default authRouter;
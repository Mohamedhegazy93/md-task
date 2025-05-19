import express from 'express';
import { register,login,logout ,refreshToken,getProfile} from '../controllers/auth.controller.js';
import {registerValidator,loginValidator} from '../utils/validators/auth.validator.js'
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post('/register',registerValidator ,register)
.post('/login',loginValidator ,login)
.post('/logout' ,logout)
.post('/refresh-token' ,refreshToken)
.get('/profile' ,protectedRoute,getProfile);

export default router;
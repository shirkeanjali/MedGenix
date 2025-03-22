import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData, uploadUserPhoto } from '../controllers/userController.js';
import upload from '../utils/fileUpload.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.post('/upload-photo', userAuth, upload.single('photo'), uploadUserPhoto);

export default userRouter;
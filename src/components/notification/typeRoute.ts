import express, { NextFunction } from "express";
import { Request, Response } from "express";
import { varifyToken, checkExpiry } from "../util/permission";
// import { register, login, updatebio, address, newPass, forgotPassword, socialLogin, getBio, imgUpload, removeImage, getPicData } from "./userControllers";
// import { verify } from "jsonwebtoken";
// import { verifyToken, checkExpiry } from "../util/auth";
// import { varifyToken, checkExpiry } from '../util/permission';
import { insertTypeData, getTypeData } from "./typeControllers";
import multer from "multer";
import path from "path";
const router = express.Router();

router.post('/inserttype', (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    insertTypeData(req, res);
});
router.get('/gettype', (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    getTypeData(req, res);
});

export default router;

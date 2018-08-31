import express from 'express';
import { Request, Response } from 'express';
import { createPackage, addReview, getReview } from './packageController';
import { filterPackage } from './packageList';
import { request } from 'https';
import { varifyToken, checkExpiry } from "../util/permission";
import multer from 'multer';
import path from 'path';
const router = express.Router();


router.post('/createpackage', varifyToken,  (req: Request, res: Response) => {
    console.log('=====in createpkg--->');
    createPackage(req, res);
});

router.post('/addreview',  varifyToken, (req: Request, res: Response) => {
    addReview(req, res);
});

router.post('/getreview', varifyToken, (req: Request, res: Response) => {
    getReview(req, res);
});

router.post('/filterpackage', varifyToken, (req: Request, res: Response) => {
    filterPackage(req, res);
});


export default router;
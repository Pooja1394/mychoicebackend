import express from 'express';
import { Request, Response } from 'express';
import {
    createCate, getCate, deleteCate, updateCate, removeImage, brandSearch, autoFillCategory
} from './categoryControllers';
import { request } from 'https';
import multer from 'multer';
import path from 'path';
import usermongos from '../brands/brandModel';
import { varifyToken, checkExpiry } from "../util/permission";
const router = express.Router();

const storage: any = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(undefined, 'src/public/images');
    },
    filename: function (req: any, file: any, cb: any) {

        cb(undefined, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage
});

router.post('/createcate', upload.array('image', 1), varifyToken, (req: Request, res: Response) => {
    createCate(req, res);
});

router.post('/getcate', varifyToken, (req: Request, res: Response) => {
    getCate(req, res);
});

router.delete('/deletecate', varifyToken, (req: Request, res: Response) => {
    deleteCate(req, res);
});

router.put('/updatecate', varifyToken, upload.array('image', 1), (req: Request, res: Response) => {
    updateCate(req, res);
});

router.delete('/removeimage', varifyToken, (req: Request, res: Response) => {
    removeImage(req, res);
});

router.get('/brandsearch', varifyToken, (req: Request, res: Response) => {
    brandSearch(req, res);
});

router.get('/autofillcategory/:_id', (req: Request, res: Response) => {
    autoFillCategory(req, res);
});

export default router;
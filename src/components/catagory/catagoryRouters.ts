import express from 'express';
import { Request, Response } from 'express';
import {
    createCate, getCate, deleteCate, updateCate, removeImage
} from './catagoryControllers';
import { request } from 'https';
import multer from 'multer';
import path from 'path';
import usermongos from '../brands/brandModel';
const router = express.Router();

const storage: any = multer.diskStorage({
    destination: function (req, file, cb: any) {
        cb(undefined, 'src/components/public/images');
    },
    filename: function (req, file, cb: any) {

        cb(undefined, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage
});

router.post('/createcate', upload.array('image', 1), (req: Request, res: Response) => {
    createCate(req, res);
});

router.get('/getcate', (req: Request, res: Response) => {
    getCate(req, res);
});

router.delete('/deletecate', (req: Request, res: Response) => {
    deleteCate(req, res);
});

router.put('/updatecate', (req: Request, res: Response) => {
    updateCate(req, res);
});

router.delete('/removeimage', (req: Request, res: Response) => {
    removeImage(req, res);
});

export default router;
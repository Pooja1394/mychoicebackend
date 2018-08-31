import express from 'express';
import { Request, Response } from 'express';
import {
    addSupplier, getSupplier, deleteSupplier, updateSupplier, removeImage,
    autoFillApi, filterBySupplierName
} from './supplierControllers';
import { request } from 'https';
import { varifyToken, checkExpiry } from "../util/permission";
import multer from 'multer';
import path from 'path';
import usermongos from '../supplier/supplierModels';
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


router.post('/addsupplier', upload.array('image', 7), varifyToken, (req: Request, res: Response) => {
    addSupplier(req, res);
});

router.post('/getsupplier', varifyToken, (req: Request, res: Response) => {
    getSupplier(req, res);
});

router.get('/autofillapi', varifyToken, (req: Request, res: Response) => {
    autoFillApi(req, res);
});

router.delete('/deletesupplier', varifyToken, (req: Request, res: Response) => {
    deleteSupplier(req, res);
});

router.put('/updatesupplier', upload.array('image', 7), varifyToken, (req: Request, res: Response) => {
    updateSupplier(req, res);
});

// router.post('/imgupload/:_id', upload.array('image', 4), verifyToken, (req: Request, res: Response) => {
//     imgUpload(req, res, );
// });

router.delete('/removeimage', varifyToken, (req: Request, res: Response) => {
    removeImage(req, res);
});

router.get('/filterbysuppliername', varifyToken, (req: Request, res: Response) => {
    filterBySupplierName(req, res);
});


export default router;
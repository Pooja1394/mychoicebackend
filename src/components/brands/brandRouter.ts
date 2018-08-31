import express from 'express';
import { Request, Response } from 'express';
import {
    createBrands, getBrands, deleteBrands,
    updateBrands, imgUpload, removeImage, autoFillBrand, filterByBrandName, supplierSearch, getSupplierBrand, getBrandSuplier
} from './brandController';
import { request } from 'https';
import multer from 'multer';
import path from 'path';
import usermongos from '../brands/brandModel';
// import { verifyToken, checkExpiry } from "../util/auth";
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

router.post('/createbrands', upload.array('image', 7), varifyToken, (req: Request, res: Response) => {
    createBrands(req, res);
});

router.post('/getbrands', varifyToken, (req: Request, res: Response) => {
    getBrands(req, res);
});

router.delete('/deletebrands', varifyToken, (req: Request, res: Response) => {
    deleteBrands(req, res);
});

router.put('/updatebrands', upload.array('image', 7), varifyToken, (req: Request, res: Response) => {
    updateBrands(req, res);
});

router.post('/imgupload/:_id', upload.array('image', 4), (req: Request, res: Response) => {
    imgUpload(req, res, );
});

router.delete('/removeimage', varifyToken, (req: Request, res: Response) => {
    removeImage(req, res);
});
router.get('/autofillbrand', (req: Request, res: Response) => {
    autoFillBrand(req, res);
});

router.get('/filterbybrandname', (req: Request, res: Response) => {
    filterByBrandName(req, res);
});

router.get('/suppliersearch', varifyToken, (req: Request, res: Response) => {
    supplierSearch(req, res);
});
router.get('/getsupplierbrand', varifyToken, (req: Request, res: Response) => {
    console.log("you are in getSubr...");
    getSupplierBrand(req, res);
});
router.post('/getbrandsuplier', varifyToken, (req: Request, res: Response) => {
    console.log("you are in getbrand...");
    getBrandSuplier(req, res);
});
export default router;
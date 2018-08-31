import express from 'express';
import { Request, Response } from 'express';
import { createProduct, getProductsByBrandId, getProduct, deleteProduct, updateProduct, autoFillProduct, removeImage, getBrand, searchSupplier, categorySearch } from './productControllers';
import { request } from 'https';
import multer from 'multer';
import path from 'path';
// import usermongos from '../brands/brandModel';
import { varifyToken } from '../util/permission';
const router = express.Router();

const storage: any = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(undefined, 'src/public/images');
    },
    filename: function (req, file, cb: any) {
        cb(undefined, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage
});

router.post('/createproduct', upload.array('image', 15), varifyToken, (req: Request, res: Response) => {
    createProduct(req, res);
});

router.post('/getproduct', varifyToken, (req: Request, res: Response) => {
    getProduct(req, res);
});

router.delete('/deleteproduct', varifyToken, (req: Request, res: Response) => {
    deleteProduct(req, res);
});

router.put('/updateproduct', varifyToken, upload.array('image', 15), (req: Request, res: Response) => {
    updateProduct(req, res);
});

router.delete('/removeimage', varifyToken, (req: Request, res: Response) => {
    removeImage(req, res);
});

router.get('/searchsupplierapi', (req: Request, res: Response) => {
    searchSupplier(req, res);
});

router.get('/categorysearch', varifyToken, (req: Request, res: Response) => {
    categorySearch(req, res);
});

router.get('/getbrands', varifyToken, (req: Request, res: Response) => {
    getBrand(req, res);
});
router.get('/getProductsByBrandId', (req: Request, res: Response) => {
    getProductsByBrandId(req, res);
});

router.post('/autofillproduct', varifyToken, (req: Request, res: Response) => {
    console.log("In routes");
    autoFillProduct(req, res);
});



export default router;
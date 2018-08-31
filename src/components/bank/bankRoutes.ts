import express, { NextFunction } from "express";
import { Request, Response } from "express";
// import { verify } from "jsonwebtoken";
import { addbank, addpackage, getpackage, getbank, editBank, removeBank, updatePackage, removePackage } from "./bankControllers";
// import { createtransfer } from "./transferController";
import { varifyToken, checkExpiry } from "../util/permission";
import multer from "multer";
import path from "path";
const router = express.Router();
const storage: any = multer.diskStorage({
    destination: function (req, file, cb: any) {
        cb(undefined, 'src/public/images');
    },
    filename: function (req, file, cb: any) {
        // cb(undefined, (typeof file.fieldname !== 'undefined') ? file.fieldname + '-' + Date.now() + path.extname(file.originalname) : '');
        cb(undefined, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

    }
});
const upload = multer({
    storage: storage
});
router.post('/addbank', upload.single('picture'), varifyToken, (req: Request, res: Response) => {
    addbank(req, res);
});
router.post('/editbank', upload.single('picture'), varifyToken, (req: Request, res: Response) => {
    editBank(req, res);
});
// router.post('/updateimage', upload.single('picture'), varifyToken, (req: Request, res: Response) => {
//     updateImage(req, res);
// });
router.delete('/removebank', varifyToken, (req: Request, res: Response) => {
    removeBank(req, res);
});
router.post('/addpackage', varifyToken, (req: Request, res: Response) => {
    addpackage(req, res);
});
router.post('/getpackage', (req: Request, res: Response) => {
    getpackage(req, res);
});
router.post('/getbank', (req: Request, res: Response) => {
    getbank(req, res);
});
router.post('/updatepackage', varifyToken, (req: Request, res: Response) => {
    updatePackage(req, res);
});
router.delete('/removepackage', varifyToken, (req: Request, res: Response) => {
    removePackage(req, res);
});

export default router;


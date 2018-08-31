import express, { NextFunction } from "express";
import { Request, Response } from "express";
import { register, login, updatebio, address, newPass, gettrans, forgotPassword, socialLogin, getBio, imgUpload, removepicture, getPicData, language, resetPass, updateamount, deleteimg } from "./userControllers";
// import { verify } from "jsonwebtoken";
import { verifyToken, checkExpiry, getIp } from "../util/auth";
import { varifyToken } from "../util/permission";
import multer from "multer";
import path from "path";
const router = express.Router();
const storage: any = multer.diskStorage({
    destination: function (req, file, cb: any) {
        cb(undefined, 'src/public/images');
    },
    filename: function (req, file, cb: any) {

        cb(undefined, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage
});
router.post("/register", (req: Request, res: Response) => {
    register(req, res);
});
router.post("/login", (req: Request, res: Response) => {
    login(req, res);
});
router.put('/updatebio', verifyToken, (req: Request, res: Response) => {
    updatebio(req, res);
});
router.put('/updateaddress', verifyToken, (req: Request, res: Response) => {
    console.log('res in update address : ', req.body.decoded.userName);
    address(req, res);
});
router.put('/changepassword', verifyToken, (req: Request, res: Response) => {
    newPass(req, res);
});
router.post('/forgotpassword', (req: Request, res: Response) => {
    forgotPassword(req, res);
});
router.post('/socialLogin', (req: Request, res: Response) => {
    socialLogin(req, res);
});
router.post('/refresh', (req: Request, res: Response, next: NextFunction) => {
    checkExpiry(req, res, next);
});
router.get('/getbio', verifyToken, (req: Request, res: Response) => {
    getBio(req, res);
});
router.post('/imageupload', upload.single('picture'), verifyToken, (req: Request, res: Response) => {
    console.log('res in routes', req.body);
    imgUpload(req, res);
});
router.get('/removeimage', verifyToken, (req: Request, res: Response) => {
    removepicture(req, res);
});
router.get('/getpicture', verifyToken, (req: Request, res: Response) => {
    getPicData(req, res);
});
//  router.get('/getip', (req: Request, res: Response) => {
//     getIp (req, res);
//  });
router.post('/lang', verifyToken, (req: Request, res: Response) => {
    language(req, res);
});
router.post('/resetpass', (req: Request, res: Response) => {
    resetPass(req, res);
});
router.put('/updateamount', varifyToken, (req: Request, res: Response) => {
    updateamount(req, res);
});
router.get('/get', varifyToken, (req: Request, res: Response) => {
    gettrans(req, res);
});
router.put('/deleteimg', varifyToken, (req: Request, res: Response) => {
deleteimg(req, res);
});
export default router;

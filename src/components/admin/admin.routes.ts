import { createAdmin, adminLogin, getAdminList, getUserSummary, uploadPicture } from './admin.controller';
import { getAllUser, resetPassword, changePassword, UpdateBio } from './admin.controller';
import * as express from "express";
import { Request, Response } from "express";
import { varifyToken, checkExpiry } from '../util/permission';
import { NextFunction } from 'express-serve-static-core';
import multer from "multer";
import path from 'path';
import decoded from 'jwt-decode';
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

const router = express.Router();
router.get("/test", (req: Request, res: Response) => {
    console.log("hello");
    res.status(200).json({ msg: 'working' });
});
/**
 * Admin signup.
 */
router.post("/register", upload.single('img'), (req: Request, res: Response) => {
    // console.log("post AdminRoutes.......?",req.query,req.body)
    createAdmin(req, res);
});
/**
 * Admin login.
 */
router.get('/login', (req: Request, res: Response) => {
    adminLogin(req, res);
});
/**
 * Admin Upload Image.
 */
router.post('/uploadImage', upload.single('picture'), varifyToken, (req: Request, res: Response) => {
    console.log("you are in uploadImage Routes & req.body.decoded is:", req.body.decoded.email);
    uploadPicture(req, res);
});
/**
 * decode token.
 */
// router.get('/list', decodeToken, (req: Request, res: Response) => {
//     getAdminList(req, res);
// });
/**
 * get all userList.
 */
router.post('/userlist', (req: Request, res: Response) => {
    console.log("you are in userlist Admin routes");
    getAllUser(req, res);
});
/**
 * get all filtered userList.
 */
// router.post('/userfilterdata', (req: Request, res: Response) => {
//     // console.log("you are in userlist Admin routes");
//     getFilterUser(req, res);
// });

// router.post('/notify', (req: Request, res: Response) => {
// console.log("you are in userlist Admin routes");
//  notify(req, res);
// });
/**
 * get summary of user API.
 */
router.post('/summary', (req: Request, res: Response) => {
    console.log("you are in user_summary Admin routes");
    getUserSummary(req, res);
});
//  router.get('/filter',(req:Request,res:Response)=>{
//      console.log("you are in Adminlist Admin routes");
//      getAllAdmin(req,res);
//  });

/**
 * change password user API.
 */
router.put('/changePassword', (req: Request, res: Response) => {
    console.log("you are in change password Admin routes");
    changePassword(req, res);
});

/**
 * reste password user API.
 */
router.put('/resetPassword', (req: Request, res: Response) => {
    console.log("you are in reset password Admin routes");
    resetPassword(req, res);
});
/**
 * user bio status api.
 */
router.put('/userbio', (req: Request, res: Response) => {
    console.log("you are in user bio API routes");
    UpdateBio(req, res);
});
/**
 * Refresh token api.
 */
router.get('/refresh', (req: Request, res: Response, next: NextFunction) => {
    console.log("you are in refresh token Api Routes");
    checkExpiry(req, res, next);
});
export default router;

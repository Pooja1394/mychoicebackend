import express from 'express';
import { Request, Response } from 'express';
import { createReviewPackage, filterPackageReview } from './packagePermissionController';
// import { reviewManagement } from './reviewManagementController';
import { filterPackage } from './packageList';
import { request } from 'https';
import { varifyToken, checkExpiry } from "../util/permission";
import multer from 'multer';
import path from 'path';
const router = express.Router();


router.post('/reviewPackage', varifyToken, (req: Request, res: Response) => {
    createReviewPackage(req, res);
});

router.post('/packageList', varifyToken, (req: Request, res: Response) => {
    filterPackageReview(req, res);
});

// router.post('/reviewManagement', varifyToken, (req: Request, res: Response) => {
//     reviewManagement(req, res);
// });
export default router;
import permissionController from './permissionController';
import * as express from 'express';
import { Request, Response, NextFunction } from "express";
import { varifyToken } from '../util/permission';

const router = express.Router();

// ------------------ Permission Routes.
const coupon = new permissionController();
router.post('/createCouponPermission', varifyToken, (req: Request, res: Response) => { coupon.createCouponPermission(req, res); });
router.post('/getAllCouponPermission', varifyToken, (req: Request, res: Response) => { coupon.getAllCouponPermission(req, res); });
// router.post('/createReviewPermission', varifyToken, (req: Request, res: Response) => { coupon.createReviewPermission(req, res); });
// router.get('/getAllReviewPermission', varifyToken, (req: Request, res: Response) => { coupon.getAllReviewPermission(req, res); });
export default router;
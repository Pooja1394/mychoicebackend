import CouponController from './couponController';
import * as express from 'express';
import { Request, Response, NextFunction } from "express";
import { varifyToken } from '../util/permission';

const router = express.Router();

// ------------------ Package Routes.
const coupon = new CouponController();
router.post('/createPackage', varifyToken, (req: Request, res: Response) => { coupon.createPackage(req, res); });
router.post('/generatePackage', varifyToken, (req: Request, res: Response) => { coupon.generatePackage(req, res); });
router.post('/getAllPackages', varifyToken, (req: Request, res: Response) => { coupon.getAllPackages(req, res); });
router.post('/getAllCoupons', varifyToken, (req: Request, res: Response) => { coupon.getAllCoupons(req, res); });
router.post('/updatePackage', (req: Request, res: Response) => { coupon.updatePackage(req, res); });

export default router;
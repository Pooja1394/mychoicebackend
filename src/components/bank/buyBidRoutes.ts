import * as express from 'express';
import { verifyToken, checkExpiry } from '../util/auth';
import { varifyToken } from '../util/permission';
import { Request, Response, NextFunction } from 'express';
import { Router } from 'express-serve-static-core';
import { create } from 'domain';
import { createbuybank, filterBuyBid, action } from './buyBidController';

const router = express.Router();
router.get('/test', verifyToken, (req: Request, res: Response) => { console.log("**You are in buyBidBUYBank routes**"); });
router.post('/createbuybank', verifyToken, (req: Request, res: Response) => { createbuybank(req, res); });
router.post('/buybidlist', varifyToken, (req: Request, res: Response) => { filterBuyBid(req, res); });
router.post('/actionbuybank', varifyToken, (req: Request, res: Response) => { action(req, res); });
export default router;
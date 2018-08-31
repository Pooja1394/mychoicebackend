import express from 'express';
import { depositCreate, tradeDetails } from './depositController';
import { Request, Response } from "express";
import { verifyToken, checkExpiry } from '../util/auth';
import { verify } from 'jsonwebtoken';
const router = express.Router();

router.post('/depositCreate', (req: Request, res: Response) => {
    depositCreate(req, res);
});
router.post('/tradeDetails', (req: Request, res: Response) => {
    tradeDetails(req, res);
});
export default router;
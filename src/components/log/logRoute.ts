import express from 'express';
import { logsCreate, filterLogs, getUserData } from './logController';
import { Request, Response } from "express";
import { verifyToken, checkExpiry } from '../util/auth';
import { verify } from 'jsonwebtoken';
const router = express.Router();

router.post('/logsCreate', (req: Request, res: Response) => {
    logsCreate(req, res);
});
router.post('/filterLogs', (req: Request, res: Response) => {
    filterLogs(req, res);
});
router.get('/getUserData', (req: Request, res: Response) => {
    getUserData(req, res);
});
export default router;
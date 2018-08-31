import express from 'express';
import { Request, Response } from "express";
import { varifyToken, checkExpiry } from '../util/permission';
import { addFeedback, getFeedback } from './userFeedbackController';

const router = express.Router();
router.post('/addFeedback', varifyToken, (req: Request, res: Response) => {
    addFeedback(req, res);
});
router.get('/getFeedback', varifyToken, (req: Request, res: Response) => {
    getFeedback(req, res);
});

export default router;
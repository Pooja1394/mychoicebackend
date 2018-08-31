import express from 'express';
import { Request, Response } from "express";
import { varifyToken, checkExpiry } from '../util/permission';
import { filterReviewManagement, createReview } from './reviewManagementController';

const router = express.Router();

router.post('/createReview', varifyToken, (req: Request, res: Response) => {
    createReview(req, res);
});

router.post('/getAllReviews', varifyToken, (req: Request, res: Response) => {
    filterReviewManagement(req, res);
});
export default router;
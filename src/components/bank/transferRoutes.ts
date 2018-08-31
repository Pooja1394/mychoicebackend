import * as express from "express";
import { verifyToken, checkExpiry } from "../util/auth";
import { varifyToken } from "../util/permission";
import { Request, Response } from "express";
import { createTransfer, filterTransferApi, transferAndWithdraw } from './transferController';
const router = express.Router();
router.post('/createtransfer', varifyToken, (req: Request, res: Response) => {
    createTransfer(req, res);
});
router.post('/filtertransfer', varifyToken, (req: Request, res: Response) => {
    filterTransferApi(req, res);
});

router.get('/check', varifyToken, (req: Request, res: Response) => {
    transferAndWithdraw(req, res);
});

export default router;
import * as express from "express";
import { verifyToken, checkExpiry } from "../util/auth";
import { varifyToken } from "../util/permission";
import { Request, Response } from "express";
import { settings, getSetting, updateSetting } from './SettingController';
const router = express.Router();
router.post('/setting', varifyToken, (req: Request, res: Response) => {
    settings(req, res);
});
router.get('/check', varifyToken, (req: Request, res: Response) => {
    getSetting(req, res);
});
router.put('/update', varifyToken, (req: Request, res: Response) => {
    updateSetting(req, res);
});
export default router;
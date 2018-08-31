import express, { NextFunction } from "express";
import { Request, Response } from "express";
// import {  } from "";
// import { verify } from "jsonwebtoken";
// import { verifyToken, checkExpiry, getIp } from "../util/auth";git
import { varifyToken } from "../util/permission";
import { sendNotification, register, removeDevice, getAllNotifications, userReply, Test } from "./notifyControllers";
import { notify, getNotification, removeNotify } from "../admin/admin.controller";
import { verifyToken } from "../util/auth";
// import { userReply } from "./userReplyControllers";
// import multer from "multer";
// import path from "path";
const router = express.Router();
router.post("/sendtext", varifyToken, (req: Request, res: Response) => {
    notify(req, res);
});
router.post("/register", verifyToken, (req: Request, res: Response) => {
    register(req, res);
});

router.post("/remove", (req: Request, res: Response) => {
    removeDevice(req, res);
});
router.get("/getnotifications", verifyToken, (req: Request, res: Response) => {
    getAllNotifications(req, res);
});
router.post("/getnotify", (req: Request, res: Response) => {
    getNotification(req, res);
});
router.post("/sendreply", verifyToken, (req: Request, res: Response) => {
    userReply(req, res);
});
router.get("/test", verifyToken, (req: Request, res: Response) => {
    Test(req, res);
});
router.delete("/removenotify", (req: Request, res: Response) => {
    removeNotify(req, res);
});

export default router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import {  } from "";
// import { verify } from "jsonwebtoken";
// import { verifyToken, checkExpiry, getIp } from "../util/auth";git
const permission_1 = require("../util/permission");
const notifyControllers_1 = require("./notifyControllers");
const admin_controller_1 = require("../admin/admin.controller");
const auth_1 = require("../util/auth");
// import { userReply } from "./userReplyControllers";
// import multer from "multer";
// import path from "path";
const router = express_1.default.Router();
router.post("/sendtext", permission_1.varifyToken, (req, res) => {
    admin_controller_1.notify(req, res);
});
router.post("/register", auth_1.verifyToken, (req, res) => {
    notifyControllers_1.register(req, res);
});
router.post("/remove", (req, res) => {
    notifyControllers_1.removeDevice(req, res);
});
router.get("/getnotifications", auth_1.verifyToken, (req, res) => {
    notifyControllers_1.getAllNotifications(req, res);
});
router.post("/getnotify", (req, res) => {
    admin_controller_1.getNotification(req, res);
});
router.post("/sendreply", auth_1.verifyToken, (req, res) => {
    notifyControllers_1.userReply(req, res);
});
router.get("/test", auth_1.verifyToken, (req, res) => {
    notifyControllers_1.Test(req, res);
});
router.delete("/removenotify", (req, res) => {
    admin_controller_1.removeNotify(req, res);
});
exports.default = router;
//# sourceMappingURL=notifyRoutes.js.map
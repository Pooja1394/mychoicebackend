"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { register, login, updatebio, address, newPass, forgotPassword, socialLogin, getBio, imgUpload, removeImage, getPicData } from "./userControllers";
// import { verify } from "jsonwebtoken";
// import { verifyToken, checkExpiry } from "../util/auth";
// import { varifyToken, checkExpiry } from '../util/permission';
const typeControllers_1 = require("./typeControllers");
const router = express_1.default.Router();
router.post('/inserttype', (req, res) => {
    // console.log('res in routes', req.body);
    typeControllers_1.insertTypeData(req, res);
});
router.get('/gettype', (req, res) => {
    // console.log('res in routes', req.body);
    typeControllers_1.getTypeData(req, res);
});
exports.default = router;
//# sourceMappingURL=typeRoute.js.map
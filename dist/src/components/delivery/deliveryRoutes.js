"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permission_1 = require("../util/permission");
// import { register, login, updatebio, address, newPass, forgotPassword, socialLogin, getBio, imgUpload, removeImage, getPicData } from "./userControllers";
// import { verify } from "jsonwebtoken";
const auth_1 = require("../util/auth");
// import { varifyToken, checkExpiry } from '../util/permission';
const deliveryControllers_1 = require("./deliveryControllers");
const router = express_1.default.Router();
router.post('/exclupload', (req, res) => {
    // console.log('res in routes', req.body);
    deliveryControllers_1.updateDeliveryCost(req, res);
});
router.post('/insertdelivery', (req, res) => {
    // console.log('res in routes', req.body);
    deliveryControllers_1.insertDeliveryData(req, res);
});
router.get('/getdeliverydata', (req, res) => {
    // console.log('res in routes', req.body);
    deliveryControllers_1.getDeliveryData(req, res);
});
router.get('/getdata', permission_1.varifyToken, (req, res) => {
    // console.log('res in routes', req.body);
    deliveryControllers_1.getDeliveryData(req, res);
});
router.post('/insertcarrier', permission_1.varifyToken, (req, res) => {
    // console.log('res in routes', req.body);
    deliveryControllers_1.addcarrier(req, res);
});
router.post('/getcarrier', (req, res) => {
    // console.log('res in routes', req.body);
    deliveryControllers_1.getCarrierName(req, res);
});
router.post('/insertservice', permission_1.varifyToken, (req, res) => {
    // console.log('res in routes', req.body);
    deliveryControllers_1.deliveryService(req, res);
});
router.get('/getcar', (req, res) => {
    // console.log('res in routes', req.body);
    deliveryControllers_1.getcarrier(req, res);
});
router.post('/getservice', (req, res) => {
    // console.log('res in routes', req.body);
    deliveryControllers_1.getService(req, res);
});
router.post('/orderprocessing', auth_1.verifyToken, (req, res) => {
    // console.log('res in routes', req.body);
    deliveryControllers_1.orderprocessing(req, res);
});
router.get('/getemployee', (req, res) => {
    // console.log('res in routes', req.body);
    deliveryControllers_1.getemployee(req, res);
});
router.post('/getorderdata', (req, res) => {
    // console.log('res in routes', req.body);
    deliveryControllers_1.getorderdata(req, res);
});
router.put('/acceptorder', (req, res) => {
    // console.log('res in routes', req.body);
    deliveryControllers_1.acceptOrder(req, res);
});
router.put('/assignorder', (req, res) => {
    // console.log('res in routes', req.body);
    deliveryControllers_1.assignOrder(req, res);
});
exports.default = router;
//# sourceMappingURL=deliveryRoutes.js.map
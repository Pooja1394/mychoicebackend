import express, { NextFunction } from "express";
import { Request, Response } from "express";
import { varifyToken, checkExpiry } from "../util/permission";
// import { register, login, updatebio, address, newPass, forgotPassword, socialLogin, getBio, imgUpload, removeImage, getPicData } from "./userControllers";
// import { verify } from "jsonwebtoken";
import { verifyToken } from "../util/auth";
// import { varifyToken, checkExpiry } from '../util/permission';
import { updateDeliveryCost, insertDeliveryData, getDeliveryData, addcarrier, getCarrierName, deliveryService, getcarrier, getService, orderprocessing, getemployee, getorderdata, acceptOrder, assignOrder } from "./deliveryControllers";
import multer from "multer";
import path from "path";
const router = express.Router();
router.post('/exclupload', (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    updateDeliveryCost(req, res);
});
router.post('/insertdelivery', (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    insertDeliveryData(req, res);
});
router.get('/getdeliverydata', (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    getDeliveryData(req, res);
});
router.get('/getdata', varifyToken, (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    getDeliveryData(req, res);
});
router.post('/insertcarrier', varifyToken, (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    addcarrier(req, res);
});
router.post('/getcarrier', (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    getCarrierName(req, res);
});
router.post('/insertservice', varifyToken, (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    deliveryService(req, res);
});
router.get('/getcar', (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    getcarrier(req, res);
});
router.post('/getservice', (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    getService(req, res);
});
router.post('/orderprocessing', verifyToken, (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    orderprocessing(req, res);
});
router.get('/getemployee', (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    getemployee(req, res);
});
router.post('/getorderdata', (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    getorderdata(req, res);
});
router.put('/acceptorder', (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    acceptOrder(req, res);
});
router.put('/assignorder', (req: Request, res: Response) => {
    // console.log('res in routes', req.body);
    assignOrder(req, res);
});
export default router;

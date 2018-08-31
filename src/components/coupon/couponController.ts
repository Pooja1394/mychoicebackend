// let couponController={}
import { Request, Response, NextFunction } from "express";
import Product from "../product/productModels";
import couponPackage from './couponPackageModel';
import coupon from './couponModel';
import * as async from 'async';
import { CreateRandomId } from "../util/utility";
import admin from '../admin/admin.model';
import mongoose from 'mongoose';
import decoded from "jwt-decode";
import moment from "moment-timezone";

const mwServer = require('../../socket/websocket');

export default class CouponController {
    async createPackage(req: Request, res: Response) {
        const body: any = req.body;
        if (body.name
            && body.owner
            && body.packageType
            && body.packageAmount
            && body.fromDate
            && body.toDate
            && body.noOfCode
            && body.status
            && body.couponCode
            && body.decoded._id
            && (
                body.balance
                || (body.supplierId)
            )
        ) {
            let createdBy: any;
            let isPackageExist: any;
            // try {
            const ip: any = req.headers['x-forwarded-for'];
            const userIp = ip.split(",")[0];
            const adminData: any = await admin.findById(mongoose.Types.ObjectId(req.body.decoded._id));
            createdBy = {
                "createdBy.name": adminData.userName,
                "createdBy.image": adminData.picture,
                "createdBy.ip": userIp,
                // "createdBy.name": "admin",
                // "createdBy.ip": "adminip",
                // "createdBy.image": "image",
            };
            isPackageExist = await couponPackage.findOne({ 'name': body.name });
            if (isPackageExist) {
                res.status(500).json({ data: 'Package Already Exist!' });
            } else {
                const savePackageObj = {
                    name: body.name,
                    owner: body.owner,
                    balance: body.balance,
                    supplierId: body.supplierId,
                    brandId: body.brandId,
                    productId: body.productId,
                    packageType: body.packageType,
                    packageAmount: body.packageAmount,
                    fromDate: new Date(body.fromDate),
                    toDate: new Date(body.toDate),
                    noOfCode: body.noOfCode,
                    status: body.status,
                    ...createdBy,
                };
                const savePackage = new couponPackage(savePackageObj);
                savePackage.save(async (err: any, data: any) => {
                    if (data && body.balance == false) {
                        let queryObj = [];
                        if (body.supplierId) {
                            queryObj.push({ 'supplierName.id': body.supplierId });
                        }
                        if (body.brandId) {
                            queryObj.push({ "brand.id": body.brandId });
                        }
                        if (body.productId) {
                            queryObj.push({ "_id": body.productId });
                        }
                        const products: any = await Product.find({ $and: queryObj });
                        async.forEach(products, (product: any, cb: any) => {
                            const saveCoupon = {
                                "code": body.couponCode,
                                "image": product.image[product.image.length - 1],
                                "productId": product._id,
                                "sendingDate": "",
                                "packageId": data._id,
                                "sales": "",
                                "promoted": "",
                                "usedDate": "",
                                "packageType": body.packageType,
                                "amount": body.packageAmount,
                                ...createdBy,
                            };
                            const saveCouponObj = new coupon(saveCoupon);
                            saveCouponObj.save(async (err: any, data: any) => {
                                if (err) {
                                    res.status(500).json({ data: err });
                                } else {
                                    cb();
                                }
                            });
                        }, (err: any) => {
                        });
                        res.status(200).json({ data: 'package created!' });
                    }
                    else {
                        res.status(500).json({ data: err });
                    }
                });
            }
        } else {
            res.status(400).json({ data: 'Incomplete parameters!' });
        }
    }
    async updatePackage(req: Request, res: Response) {
        const body: any = req.body;
        if (body.objectId
            && body.name
            && body.owner
            && body.packageType
            && body.packageAmount
            && body.fromDate
            && body.toDate
            && body.noOfCode
            && body.status
            && body.couponCode
            && body.decoded._id
            && (
                body.balance
                || (body.supplierId)
            )
        ) {
            let createdBy: any = 'name';
            let isPackageExist: any;
            // try {
            const ip: any = req.headers['x-forwarded-for'];
            const userIp = ip.split(",")[0];
            const adminData: any = await admin.findById(mongoose.Types.ObjectId(req.body.decoded._id));
            createdBy = {
                "createdBy.name": adminData.userName,
                "createdBy.ip": userIp,
                "createdBy.image": adminData.picture
                // "createdBy.name": "admin",
                // "createdBy.ip": "adminip",
                // "createdBy.image": "image",
            };
            const savePackageObj = {
                name: body.name,
                owner: body.owner,
                balance: body.balance,
                supplierId: body.supplierId,
                brandId: body.brandId,
                productId: body.productId,
                packageType: body.packageType,
                packageAmount: body.packageAmount,
                fromDate: new Date(body.fromDate),
                toDate: new Date(body.toDate),
                noOfCode: body.noOfCode,
                status: body.status,
                ...createdBy,
            };
            isPackageExist = await couponPackage.findOne({ '_id': body.objectId });
            let updatePackage = couponPackage.updateOne({ '_id': body.objectId }, { $set: { ...savePackageObj } }, async (err: any, data: any) => {
                if ((body.supplierId != isPackageExist.supplierId)
                    || (body.brandId != isPackageExist.brandId)
                    || (body.productId != isPackageExist.productId)) {
                    coupon.remove({ 'packageId': body.objectId }, async (err: any) => {
                        if (err) {
                            res.status(200).json({ data: 'coupons deleted!' });
                        } else {
                            let queryObj = [];
                            if (body.supplierId) {
                                queryObj.push({ 'supplierName.id': body.supplierId });
                            }
                            if (body.brandId) {
                                queryObj.push({ "brand.id": body.brandId });
                            }
                            if (body.productId) {
                                queryObj.push({ "_id": body.productId });
                            }
                            const products: any = await Product.find({ $and: queryObj });
                            async.forEach(products, async (product: any, cb: any) => {
                                const saveCoupon = {
                                    "code": body.couponCode,
                                    "image": product.image[product.image.length - 1],
                                    "productId": product._id,
                                    "sendingDate": "",
                                    "packageId": data._id,
                                    "sales": "",
                                    "promoted": "",
                                    "usedDate": "",
                                    "packageType": body.packageType,
                                    "amount": body.packageAmount,
                                    "createdBy": createdBy,
                                    ...createdBy,
                                };
                                const saveCouponObj = new coupon(saveCoupon);
                                saveCouponObj.save(async (err: any, data: any) => {
                                    if (err) {
                                        res.status(500).json({ data: err });
                                    } else {
                                        cb();
                                    }
                                });
                            }, (err: any) => {
                                res.status(200).json({ data: 'package updated!' });
                            });
                        }
                    });
                } else {
                    coupon.update({ 'packageId': body.objectId }, { $set: { 'code': body.couponCode, 'amount': body.packageAmount, 'packageType': body.packageType } }, { multi: true }, (err: any, data: any) => {
                        if (err) {
                            res.status(500).json({ data: 'Try Again!' });
                        } else {
                            res.status(200).json({ data: 'package updated!' });
                        }
                    });
                }
            });
        } else {
            res.status(400).json({ data: 'Incomplete parameters!' });
        }
    }
    async generatePackage(req: Request, res: Response) {
        // console.log("websocket in coupon---------->", webServer);
        const body: any = req.body;
        if (body.supplierId) {
            let products: any = [];
            let queryObj = [];
            if (body.supplierId) {
                queryObj.push({ 'supplierName.id': body.supplierId });
            }
            if (body.brandId) {
                queryObj.push({ "brand.id": body.brandId });
            }
            if (body.productId) {
                queryObj.push({ "_id": body.productId });
            }
            const data: any = await Product.find({ $and: queryObj }).select(['productNameEn', 'image']);
            let couponData: any = [];
            let couponCode = CreateRandomId(3, 'coupon');
            try {
                async.forEach(data, (element: any, cb: any) => {
                    couponData = couponData.concat({ '_id': element._id, 'image': element.image[0], "couponCode": couponCode, "permission": element.productNameEn });
                    cb();
                });
                res.status(200).json({ data: couponData });
            } catch (err) {
                res.status(500).json({ data: err });
            }
        } else {
            res.status(400).json({ data: 'Incomplete Arguments!' });
        }
    }
    async getAllPackages(req: Request, res: Response) {
        let page: any = req.query.page ? parseInt(req.query.page) : 1;
        let limit: any = req.query.limit ? parseInt(req.query.limit) : 10;
        let condition: any = {};
        if (req.body.name) {
            condition.name = { $regex: `${req.body.name}`, $options: 'i' };
        }
        if (req.body.owner) {
            condition.owner = { $regex: `${req.body.owner}`, $options: 'i' };
        }
        if (req.body.packageAmount) {
            condition.packageAmount = { $regex: `${req.body.packageAmount}`, $options: 'i' };
        }
        if (req.body.packageType) {
            condition.packageType = { $regex: `${req.body.packageType}`, $options: 'i' };
        }
        if (req.body.noOfCode) {
            condition.noOfCode = { $regex: `${req.body.noOfCode}`, $options: 'i' };
        }
        if (req.body.status) {
            condition.status = { $regex: `${req.body.status}`, $options: 'i' };
        }
        if (req.body.createdBy) {
            condition["createdBy.name"] = {
                $regex: `${req.body.createdBy}`, $options: 'i'
            };
        }
        if (req.body.createdAt) {
            const searchDate = moment(req.body.createdAt).format('YYYY-MM-DD') + "T00:00:00.000";
            const searchGtDate = moment(req.body.createdAt).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
            let value: any = {};
            if (((new Date(searchDate)).toString() == 'Invalid Date') || ((new Date(searchGtDate)).toString() == 'Invalid Date')) {
                res.status(200).json({ data: 'Invalid Created Date!' });
            }
            value = {
                '$lt': searchGtDate,
                '$gte': searchDate
            };
        }
        couponPackage.find({}, async (err: any, data: any) => {
            const packages: any = await couponPackage.find(condition).skip((page - 1) * limit).limit(limit).select(['name', 'packageType', 'packageAmount', 'noOfCode', 'createdAt', 'owner', 'status', 'createdBy']);
            if (!packages) {
                res.status(200).json({ data: [], totalCount: data.length });
            } else {
                res.status(200).json({ data: packages, totalCount: data.length });
            }
        });
    }
    async getAllCoupons(req: Request, res: Response) {
        let page: any = req.query.page ? parseInt(req.query.page) : 1;
        let limit: any = req.query.limit ? parseInt(req.query.limit) : 10;
        let condition: any = {};
        if (req.body.code) {
            condition.code = { $regex: `${req.body.code}`, $options: 'i' };
        }
        if (req.body.sendingDate) {
            const searchDate = moment(req.body.sendingDate).format('YYYY-MM-DD') + "T00:00:00.000";
            const searchGtDate = moment(req.body.sendingDate).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
            let value: any = {};
            if (((new Date(searchDate)).toString() == 'Invalid Date') || ((new Date(searchGtDate)).toString() == 'Invalid Date')) {
                res.status(200).json({ data: 'Invalid Sending Date!' });
            }
            value = {
                '$lt': searchGtDate,
                '$gte': searchDate
            };
            condition.sendingDate = value;
        }
        if (req.body.usedDate) {
            const searchDate = moment(req.body.usedDate).format('YYYY-MM-DD') + "T00:00:00.000";
            const searchGtDate = moment(req.body.usedDate).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
            let value: any = {};
            if (((new Date(searchDate)).toString() == 'Invalid Date') || ((new Date(searchGtDate)).toString() == 'Invalid Date')) {
                res.status(200).json({ data: 'Invalid Used Date!' });
            }
            value = {
                '$lt': searchGtDate,
                '$gte': searchDate
            };
            condition.usedDate = value;
        }
        if (req.body.packageType) {
            condition.packageType = { $regex: `${req.body.packageType}`, $options: 'i' };
        }
        if (req.body.sales) {
            condition.sales = { $regex: `${req.body.sales}`, $options: 'i' };
        }
        if (req.body.promoted) {
            condition.promoted = { $regex: `${req.body.promoted}`, $options: 'i' };
        }
        if (req.body.amount) {
            condition.amount = { $regex: `${req.body.amount}`, $options: 'i' };
        }
        if (req.body.createdBy) {
            condition["createdBy.name"] = {
                $regex: `${req.body.createdBy}`, $options: 'i'
            };
        }
        if (req.body.createdAt) {
            const searchDate = moment(req.body.createdAt).format('YYYY-MM-DD') + "T00:00:00.000";
            const searchGtDate = moment(req.body.createdAt).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
            let value: any = {};
            value = {
                '$lt': searchGtDate,
                '$gte': searchDate
            };
            condition.createdAt = value;
        }
        coupon.find({}, async (err: any, data: any) => {
            const allcoupon: any = await coupon.find(condition).skip((page - 1) * limit).limit(limit);
            if (!allcoupon) {
                res.status(200).json({ data: [], totalCount: data.length });
            } else {
                res.status(200).json({ data: allcoupon, totalCount: data.length });
            }
        });

    }

}
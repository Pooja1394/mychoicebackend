// let couponController={}
import { Request, Response, NextFunction } from "express";
import Permission from './permissionModel';
import * as async from 'async';
import user from '../user/userModels';
import couponPackage from '../coupon/couponPackageModel';
import packageReviewModel from '../review/packageModel';
import admin from '../admin/admin.model';
import mongoose from 'mongoose';
import decoded from "jwt-decode";
import moment from "moment-timezone";
import coupon from'../coupon/couponModel';

export default class CouponController {
    async createCouponPermission(req: Request, res: Response) {
        const body = req.body;
        if (body.packageId && body.userIds.length > 0 && body.decoded && body.decoded._id) {
            const permissionExist: any = await Permission.findOne({ 'packageId': body.packageId });
            if (permissionExist) {
                res.status(400).json({ data: 'Permission already Exist!' });
            } else {
                try {
                    let userIdExist: any = true;
                    const packExist: any = await couponPackage.findOne({ '_id': body.packageId });
                    async.forEach(body.userIds, async (userId: any, cb: any) => {
                        const userExist: any = await user.findOne({ '_id': userId });
                        if (userExist == undefined) {
                            userIdExist = false;
                            res.status(400).json({ data: 'userId ' + userId + " doesn't exist." });
                        }
                    });
                    const ip: any = req.headers['x-forwarded-for'];
                    const userIp = ip.split(",")[0];
                    const adminData: any = await admin.findById(mongoose.Types.ObjectId(body.decoded._id));
                    const createdBy = {
                        "createdBy.name": adminData.userName,
                        "createdBy.image": adminData.picture,
                        "createdBy.ip": userIp,
                        // "createdBy.name": "admin",
                        // "createdBy.ip": "adminip",
                        // "createdBy.image": "image",
                    };
                    const permissionObj = {
                        packageId: body.packageId,
                        permissionTo: body.userIds,
                        type: 'coupon',
                        ...createdBy,
                    };
                    const savePermission: any = new Permission(permissionObj);
                    savePermission.save(async (err: any, data: any) => {
                        data && coupon.update({ 'packageId': body.packageId }, { $set: { 'sendingDate': new Date()} }, { multi: true }, (err: any, data: any) => {
                            if (err) {
                                res.status(500).json({ data: 'Try Again!' });
                            } else {
                                res.status(200).json({ data: 'Permission created!' });
                            }
                        });
                        // data && res.status(200).json({ data: 'Permission created!' });
                    });
                } catch (err) {
                    res.status(500).json({ data: err });
                }
            }
        } else {
            res.status(400).json({ data: 'Incomplete Arguments!' });
        }
    }
    async getAllCouponPermission(req: Request, res: Response) {
        let body = req.body;
        let allPermissions: any = [];
        let page: any = req.query.page ? parseInt(req.query.page) : 1;
        let limit: any = req.query.limit ? parseInt(req.query.limit) : 10;
        let condition1: any = {};
        let condition: any = {};
        condition1.type = { $regex: `${'coupon'}`, $options: 'i' };
        // if (req.body.permissionId) {
        //     condition1._id = { $regex: `${req.body.permissionId}`, $options: 'i' };
        // }
        if (req.body.packageName) {
            condition.name = { $regex: `${req.body.packageName}`, $options: 'i' };
        }
        if (req.body.packageOwner) {
            condition.owner = { $regex: `${req.body.packageOwner}`, $options: 'i' };
        }
        if (req.body.packageType) {
            condition.packageType = { $regex: `${req.body.packageType}`, $options: 'i' };
        }
        if (req.body.packageAmount) {
            condition.packageAmount = { $regex: `${req.body.packageAmount}`, $options: 'i' };
        }
        if (req.body.noOfCode) {
            condition.noOfCode = { $regex: `${req.body.noOfCode}`, $options: 'i' };
        }
        if (req.body.packagestatus) {
            condition.status = { $regex: `${req.body.packagestatus}`, $options: 'i' };
        }
        if (req.body.createdBy) {
            condition["createdBy.name"] = {
                $regex: `${req.body.createdBy}`, $options: 'i'
            };
        }
        if (req.body.createdDate) {
            const searchDate = moment(req.body.createdDate).format('YYYY-MM-DD') + "T00:00:00.000";
            const searchGtDate = moment(req.body.createdDate).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
            let value: any = {};
            if (((new Date(searchDate)).toString() == 'Invalid Date') || ((new Date(searchGtDate)).toString() == 'Invalid Date')) {
                res.status(200).json({ data: 'Invalid Created Date!' });
            }
            value = {
                '$lt': searchGtDate,
                '$gte': searchDate
            };
            condition.createdAt = value;
        }
        try {
            let permissions = await Permission.find(condition1).skip((page - 1) * limit).limit(limit);
            Permission.find({}, (err: any, data: any) => {
                if (!permissions) {
                    res.status(200).json({ data: [], totalCount: data.length });
                } else {
                    async.forEach(permissions, async (element: any, cb: any) => {
                        const coupons: any = await couponPackage.findOne({ '_id': element.packageId, ...condition }).select(['name', 'packageType', 'noOfCode', 'packageAmount', 'owner', 'createdBy', 'status', 'createdAt']);
                        if (!coupons) {
                            res.status(200).json({ data: [], totalCount: data.length });
                        }
                        const data1: any = {
                            "permissionId": element._id,
                            "createdDate": element.createdAt,
                            "createdBy": element.createdBy,
                            "packageName": coupons.name,
                            "packageOwner": coupons.owner,
                            "packageType": coupons.packageType,
                            "packageAmount": coupons.packageAmount,
                            "noOfCode": coupons.noOfCode,
                            "packagestatus": coupons.status,
                        };
                        allPermissions = allPermissions.concat(data1);
                        cb();
                    }, err => {
                        res.status(200).json({ data: allPermissions, totalCount: data.length });

                    });
                }
            });
        } catch (err) {
            res.status(500).json({ data: err });
        }
    }
    // async createReviewPermission(req: Request, res: Response) {
    //     const body = req.body;
    //     if (body.packageId && body.userName.length > 0 && body.decoded && body.decoded._id) {
    //         const permissionExist: any = await Permission.findOne({ 'packageId': body.packageId });
    //         if (permissionExist) {
    //             res.status(400).json({ data: 'Permission already Exist!' });
    //         } else {
    //             try {
    //                 let userIdExist: any = true;
    //                 const packExist: any = await packageReviewModel.findOne({ '_id': body.packageId });
    //                 async.forEach(body.userName, async (userId: any, cb: any) => {
    //                     const userExist: any = await user.findOne({ '_id': userId });
    //                     if (userExist == undefined) {
    //                         userIdExist = false;
    //                         res.status(400).json({ data: 'userId ' + userId + " doesn't exist." });
    //                     }
    //                 });
    //                 const ip: any = req.headers['x-forwarded-for'];
    //                 const userIp = ip.split(",")[0];
    //                 const adminData: any = await admin.findById(mongoose.Types.ObjectId(body.decoded._id));
    //                 const createdBy = {
    //                     "createdBy.name": adminData.userName,
    //                     "createdBy.image": adminData.picture,
    //                     "createdBy.ip": userIp,
    //                 };
    //                 const reviewObj = {
    //                     packageId: body.packageId,
    //                     permissionTo: body.userIds,
    //                     type: 'review',
    //                     ...createdBy,
    //                 };
    //                 const savePermission: any = new Permission(reviewObj);
    //                 savePermission.save(async (err: any, data: any) => {
    //                     data && res.status(200).json({ data: 'Permission created!' });
    //                 });
    //             } catch (err) {
    //                 res.status(500).json({ data: err });
    //             }
    //         }
    //     } else {
    //         res.status(400).json({ data: 'Incomplete Arguments!' });
    //     }
    // }
    //     async getAllReviewPermission(req: Request, res: Response) {
    //         let body = req.body;
    //         let allPermissions: any = [];
    //         try {
    //             let permissions = await Permission.find({ 'type': 'review' });
    //             async.forEach(permissions, (element: any, cb: any) => {
    //                 const review: any = couponPackage.findOne({ '_id': element.packageId }).select(['name', 'couponType', 'noOfCode', 'packageAmount', 'owner', 'createdBy', 'status']);
    //                 const data: any = {
    //                     "permissionId": element._id,
    //                     "createdDate": element.createdAt,
    //                     "createdBy": element.createdBy,
    //                     "packageName": review.name,
    //                     "packageOwner":review.owner,
    //                     "packageType": review.couponType,
    //                     "packageAmount": review.packageAmount,
    //                     "noOfCode": review.noOfCode,
    //                     "packagestatus": review.status,
    //                 };
    //                 allPermissions = allPermissions.concat(data);
    //                 cb();
    //             }, err => {
    //                 res.status(200).json({ data: allPermissions });
    //             });
    //         } catch (err) {
    //             res.status(500).json({ data: err });
    //         }
    //     }
}
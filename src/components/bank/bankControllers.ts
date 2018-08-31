import express from "express";
import bankmongo from "./bankModels";
import bidmongo from "./bidModels";
import usermongo from "../user/userModels";
import bcrypt from "bcryptjs";
import axios from "axios";
import _ from "lodash";
const requestIp = require('request-ip');
import admin from "../admin/admin.model";
import decoded from "jwt-decode";
import mongoose from 'mongoose';
import multer from "multer";
import moment from "moment-timezone";
import { createToken } from "../util";
import path from "path";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import async, { log } from "async";
export const jwt_secret = "ADIOS AMIGOS";
import constatnt from '../config/constant';
import userModel from "../user/userModels";
import { Types } from '../../socket/types';
import { sendNotification } from '../notification/notifyControllers';
import deviceModel from "../notification/deviceModel";
const app = express();
// const download = require('picture-downloader');
import { Response, Request, NextFunction } from "express";
import { json, raw } from "body-parser";
import constant from "../config/constant";
export const getpackage = async (req: Request, res: Response) => {
    try {
        let skip_Value;
        let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
        if (req.query.page != undefined && req.query.page > 1) {
            skip_Value = limitValue * (req.query.page - 1);
        } else { skip_Value = 0; }
        if (req.query.limit != undefined) {
            limitValue = parseInt(req.query.limit);
        }
        const condition: any = {};
        if (req.body.bidPackageName) {
            condition.bidPackageName = new RegExp('^' + req.body.bidPackageName, "i");
        }
        if (req.body.noOfBids) {
            condition.noOfBids = new RegExp('^' + req.body.noOfBids, "i");
        }
        if (req.body.amount) {
            condition.amount = new RegExp('^' + req.body.amount, "i");
        }
        if (req.body.createdBy) {
            condition["createdBy.userName"] = {
                $regex: `${req.body.createdBy}`, $options: 'i'
            };
        }
        if (req.body.createdAt) {
            const searchDate = moment(req.body.createdAt).format('YYYY-MM-DD') + "T00:00:00.000";
            const searchGtDate = moment(req.body.createdAt).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
            // '$lt': '2017-05-06T00:00:00Z'
            //  "2018-04-24T20:15:35.142Z"
            let value: any = {};
            value = {
                '$lt': searchGtDate,
                '$gte': searchDate
            };
            condition.createdAt = value;
        }
        await bidmongo.find(condition, { __v: 0 },
            async (err: any, data: any) => {
                console.log(`user:----`, err, data);
                if (data) {
                    const count: any = await bidmongo.count(condition);
                    console.log('count----->', count, limitValue);
                    const totalPages = Math.ceil(count / limitValue);
                    console.log('totalpage', totalPages);
                    res.status(200).json({ data, totalPages });
                }
                else {
                    res.status(400).json("Cannot find data");
                }
            }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        // console.log("get Package condition is:", condition);
        // const result = await bidmongo.find(condition, {__v: 0 });
        // const count = await bidmongo.count(condition);
        // const totalPage = Math.ceil(count / limitValue);
        // res.status(200).json({result, totalPage});
    } catch (error) {
        console.log("Error Found");
        res.status(500).json(error);
    }
};
export const getbank = async (req: Request, res: Response) => {
    try {
        let skip_Value;
        let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
        if (req.query.page != undefined && req.query.page > 1) {
            skip_Value = limitValue * (req.query.page - 1);
        } else { skip_Value = 0; }
        if (req.query.limit != undefined) {
            limitValue = parseInt(req.query.limit);
        }
        const condition: any = {};
        if (req.body.bankName) {
            condition.bankName = { $regex: `${req.body.bankName}`, $options: 'i' };
            // condition.bankName = new RegExp('^' + req.body.bankName, "i");
        }
        if (req.body.bankShortName) {
            condition.bankShortName = { $regex: `${req.body.bankShortName}`, $options: 'i' };
            // new RegExp('^' + req.body.bankShortName, "i");
        }
        if (req.body.createdBy) {
            condition["createdBy.name"] = {
                $regex: `${req.body.createdBy}`, $options: 'i'
            };
        }
        if (req.body.createdAt) {
            const searchDate = moment(req.body.createdAt).format('YYYY-MM-DD') + "T00:00:00.000";
            const searchGtDate = moment(req.body.createdAt).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
            // '$lt': '2017-05-06T00:00:00Z'
            //  "2018-04-24T20:15:35.142Z"
            let value: any = {};
            value = {
                '$lt': searchGtDate,
                '$gte': searchDate
            };
            condition.createdAt = value;
        }
        console.log(" ---- ", condition);
        await bankmongo.find(condition, { __v: 0 },
            async (err, data: any) => {
                console.log(`user:----`, err, data);
                if (data) {
                    const count: any = await bankmongo.count(condition);
                    console.log('count----->', count, limitValue);
                    const totalPages = Math.ceil(count / limitValue);
                    console.log('totalpage', totalPages);
                    res.status(200).json({ data, totalPages });
                } else {
                    res.status(400).json("Cannot find data");
                }
            }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        // console.log("get Package condition is:", condition);
        // const result = await bidmongo.find(condition, {__v: 0 });
        // const count = await bidmongo.count(condition);
        // const totalPage = Math.ceil(count / limitValue);
        // res.status(200).json({result, totalPage});
    } catch (error) {
        console.log("Error Found");
        res.status(500).json(error);
    }
};
export const addpackage: any = (req: Request, res: Response) => {
    if (req.body.bidPackageName && req.body.noOfBids && req.body.amount) {
        bidmongo.findOne({ bidPackageName: req.body.bidPackageName },
            async (err: any, result: any) => {
                console.log("result ---->", result);
                if (err) {
                    res.status(500).json(err);
                }
                else if (result) {
                    console.log('in else result');
                    res.status(400).json({
                        msg: "Package Already exist"
                    });
                }
                else {
                    const ip: any = req.headers['x-forwarded-for'];
                    const userIp = ip.split(",")[0];
                    console.log('in else save ');
                    console.log('req.-------->', req.body);
                    console.log("--", req.body.decoded);
                    const adminData: any = await admin.findById(mongoose.Types.ObjectId(req.body.decoded._id));
                    const user = new bidmongo({
                        bidPackageName: req.body.bidPackageName,
                        noOfBids: req.body.noOfBids,
                        amount: req.body.amount,
                        status: req.body.status,
                        createdBy: {
                            name: adminData.userName,
                            img: adminData.picture,
                            ip: userIp
                        }
                    });
                    user.save(async (err: any, data: any) => {
                        if (err) {
                            console.log("err=", err);
                            res.json({

                                err: err
                            });
                        }
                        else if (data) {

                            const obj = {
                                bidPackageName: data.bidPackageName,
                                noOfBids: data.noOfBids,
                                amount: data.amount,
                                createdBy: data.createdBy,
                                status: data.status,
                                msg: "Package added successfully",
                            };
                            let registeredUsers = await deviceModel.find();
                            async.forEach(registeredUsers, async (fcmUser: any) => {
                                let info = {};
                                let obj = {
                                    title: 'new-transition',
                                    notificationType: Types.BID_PACKAGE_UPDATE,
                                    content: 'update-bid-package',
                                    data: {
                                        "type": Types.BID_PACKAGE_UPDATE,
                                        "_id": data._id,
                                        "bidPackageName": data.bidPackageName,
                                        "noOfBids": data.noOfBids,
                                        "amount": data.amount,
                                        "status": data.status
                                    }
                                };
                                await sendNotification(obj, info, fcmUser.token, (err: any, data: any) => {
                                });
                            });
                            res.status(200).json({
                                obj
                            });
                        }
                    });
                }
            });
    }
    else {
        res.status(406).json({
            statusCode: 406,
            msg: "fill all details correctly",
        });
    }
};
export const addbank: any = (req: Request, res: Response) => {
    // console.log("Signup ", req.body);
    if (req.body.bankName && req.body.bankShortName) {
        bankmongo.findOne({ bankName: req.body.bankName },
            async (err: any, result: any) => {
                console.log("result ---->", result);
                if (err) {
                    console.log('in iff err');

                    res.status(500).json(err);
                }
                else if (result) {
                    console.log('in else result');
                    res.status(400).json({
                        msg: "Bank Already exist"
                    });
                }
                else {
                    const ip: any = req.headers['x-forwarded-for'];
                    const userIp = ip.split(",")[0];
                    console.log('in else save ');
                    console.log('req.-------->', req.body);
                    req.body.picture = constant.url + req.file.filename;
                    console.log("--", req.body.decoded);
                    const adminData: any = await admin.findById(mongoose.Types.ObjectId(req.body.decoded._id));
                    const user = new bankmongo({
                        bankName: req.body.bankName,
                        bankShortName: req.body.bankShortName,
                        picture: req.body.picture,
                        status: req.body.status,
                        createdBy: {
                            name: adminData.userName,
                            img: adminData.picture,
                            ip: userIp
                        }
                    });
                    user.save(async (err, data: any) => {
                        if (err) {
                            console.log("err=", err);
                            res.json({

                                err: err
                            });
                        }
                        else if (data) {

                            const obj = {
                                bankeName: data.bankName,
                                bankShortName: data.bankShortName,
                                picture: data.picture,
                                createdBy: data.createdBy,
                                status: data.status,
                                msg: "Bank added successfully",
                            };
                            res.status(200).json({
                                obj
                            });
                        }
                    });
                }
            });
    }
    else {
        res.status(406).json({
            statusCode: 406,
            msg: "fill all details correctly",
        });
    }

};
export let editBank = async (req: Request, res: Response) => {
    console.log("body in editBank.....", req.body, req.file);
    let picture: any = '';
    if (req.file) {
        picture = constant.url + req.file.filename;
        console.log("body picture in editBank.....", picture);
    }
    try {
        let obj: any = {};
        if (req.file) {
            obj.picture = picture;
        }
        if (req.body.bankName) {
            obj.bankName = req.body.bankName;
        }
        if (req.body.bankShortName) {
            obj.bankShortName = req.body.bankShortName;
        }
        if (req.body.status) {
            obj.status = req.body.status;
        }
        console.log("editBnk obj else{}--->", obj);
        const bankData: any = await bankmongo.findByIdAndUpdate({ _id: req.body.bankID }, { $set: obj }, { new: true });
        res.status(200).json(bankData);
    }
    catch (error) {
        res.status(500).json(error);
    }
};

export let removeBank = async (req: Request, res: Response) => {
    try {
        console.log("body n remove_Bnak==", req.body);
        const bankData = await bankmongo.findByIdAndRemove(mongoose.Types.ObjectId(req.body.bankID));
        res.status(200).json("Bank Remove Succesfully!");
    }
    catch (error) {
        res.status(500).json(error);
    }
};
export let updatePackage = async (req: Request, res: Response) => {
    console.log("body n updt_pkg==>", req.body);
    let obj: any = {};
    try {
        if (req.body.bidPackageName) {
            obj.bidPackageName = req.body.bidPackageName;
        }
        if (req.body.noOfBids) {
            obj.noOfBids = req.body.noOfBids;
        }
        if (req.body.amount) {
            obj.amount = req.body.amount;
        }
        if (req.body.status === true || req.body.status === false) {
            obj.status = req.body.status;
        }
        console.log("obj in update packages is===>", obj);

        const updateBidPackages: any = await bidmongo.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.bidID), { $set: obj }, { new: true });
        console.log("updated Data---------->", updateBidPackages);
        const adminData: any = await admin.findById(mongoose.Types.ObjectId(req.body.decoded._id));
        let registeredUsers = await deviceModel.find(); // , async (err: any, notify: any) => {
        async.forEach(registeredUsers, async (fcmUser: any) => {
            let info = {};
            let obj = {
                title: 'new-transition',
                notificationType: Types.BID_PACKAGE_UPDATE,
                content: 'update-bid-package',
                data: {
                    "type": Types.BID_PACKAGE_UPDATE,
                    "_id": updateBidPackages._id,
                    "bidPackageName": updateBidPackages.bidPackageName,
                    "noOfBids": updateBidPackages.noOfBids,
                    "amount": updateBidPackages.amount,
                    "status": updateBidPackages.status
                }
            };
            await sendNotification(obj, info, fcmUser.token, (err: any, data: any) => {
            });
        });
        res.status(200).json({ msg: "Package update Successfully!", updateBidPackages });
    }
    catch (error) {
        res.status(500).json(error);
    }
};
export let removePackage = async (req: Request, res: Response) => {
    try {
        console.log("body n remove_pkg==", req.body);
        const bidData = await bidmongo.findByIdAndRemove(mongoose.Types.ObjectId(req.body.bidID));
        let registeredUsers = await deviceModel.find();
        async.forEach(registeredUsers, async (fcmUser: any) => {
            let info = {};
            let obj = {
                title: 'new-transition',
                notificationType: Types.BID_PACKAGE_UPDATE,
                content: 'update-bid-package',
                data: {
                    "type": Types.BID_PACKAGE_DELETE,
                    "_id": req.body.bidID,
                }
            };
            await sendNotification(obj, info, fcmUser.token, (err: any, data: any) => {
            });
        });
        res.status(200).json({ msg: "Remove Succesfully!" });
    }
    catch (error) {
        res.status(500).json(error);
    }
};


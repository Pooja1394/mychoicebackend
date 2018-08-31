import espress from "express";
import transfermongos from "./transferModel";
import { Request, Response, NextFunction } from 'express';
import userModels from "../user/userModels";
import settings from "../settings/settingModel";
import mongoose from 'mongoose';
import admin from "../admin/admin.model";
import bidModels from "./bidModels";
import decoded from "jwt-decode";
import constant from "../config/constant";
import { assertWithStatement } from "babel-types";
import moment from "moment-timezone";
import _ from "lodash";
import *as async from "async";
import { onlineUser } from '../../socket/websocket';
import { Types } from '../../socket/types';
import { sendNotification } from '../notification/notifyControllers';
import deviceModel from "../notification/deviceModel";

export const createTransfer = async (req: Request, res: Response) => {
    try {
        await async.forEach(req.body.userId, async (element: any, cb) => {
            const ip: any = req.headers['x-forwarded-for'];
            const userIp = ip.split(",")[0];
            const userData: any = await userModels.findOne({ _id: element._id }, { email: 1, userName: 1, loginType: 1, balance: 1, picture: 1 });
            const num1: any = parseInt(userData.balance);
            const num2: any = parseInt(element.amount);
            let total: any = num1 + num2;
            const transferNum: any = num1;
            const withdrawNum: any = total;
            await userModels.findOne({ _id: element._id }, async function (err: any, data: any) {
                if (err)
                    throw err;
                else {
                    if (data && total < 1) {
                        data.balance = 0;
                        total = 0;
                        await data.save();
                    }
                    else if (data) {
                        data.balance = total;
                        await data.save();
                    } else {
                        console.log("Balance data not found");
                    }
                }
            });
            let message: any = '';
            let bal = 0;
            if (withdrawNum > transferNum) {
                message = 'Transfer';
            }
            else {
                message = 'Withdraw';
            }
            if (element.amount < 0 && element.amount * -1 > userData.balance) {
                bal = userData.balance;
            }
            else {
                bal = Math.abs(element.amount);
            }
            if (userData) {
                const adminData: any = await admin.findById(mongoose.Types.ObjectId(req.body.decoded._id));
                const settingData: any = await settings.findById(mongoose.Types.ObjectId(req.body._id));
                const transferData: any = new transfermongos({
                    userID: element._id,
                    email: userData.email,
                    userName: userData.userName,
                    transferAction: true,
                    loginType: userData.loginType,
                    balance: total,
                    name: {
                        userName: userData.userName,
                        img: userData.picture,
                        ip: userIp
                    },
                    createdBy: {
                        userName: adminData.userName,
                        picture: adminData.picture,
                        ip: userIp
                    },
                    amount: bal,
                    totalAmt: bal * settingData.bidSellingPrice,
                    transferBy: 'Manual',
                    transfer: message,
                });
                await transferData.save();
                deviceModel.findOne({ userId: userData._id }, async (err: any, notify: any) => {
                    if (err) throw err;
                    else {
                        let info = {};
                        let obj = {
                            title: 'new-transition',
                            notificationType: Types.CREATE_TRANSFER,
                            content: { balance: total },
                            data: {
                                amount: total,
                                type: Types.CREATE_TRANSFER,
                            }
                        };
                        sendNotification(obj, info, notify.token, async (err: any, data: any) => {
                        });
                    }
                });

                // let respondToUser = await onlineUser.filter((user: any) => user.userId == userData._id);
                // console.log("respondToUser-------->", respondToUser, respondToUser.length > 0);
                // if (respondToUser.length > 0) {
                //     async.forEach(respondToUser, (userSession: any) => {
                //         userSession.ws.send(JSON.stringify({ 'type': Types.CREATE_TRANSFER, 'amount': total }));
                //     });
                // }
            }
        });
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json(error);
    }
};
export const filterTransferApi = async (req: Request, res: Response) => {
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
        if (true) {
            condition.transferAction = true;
            if (req.body.email) {
                condition.email = {
                    $regex: `${req.body.email}`, $options: 'i'
                };
            }
            if (req.body.loginType) {
                condition.loginType = {
                    $regex: `${req.body.loginType}`, $options: 'i'
                };
            }
            if (req.body.userName) {
                condition["name.userName"] = {
                    $regex: `${req.body.userName}`, $options: 'i'
                };
            }
            if (req.body.balance) {
                condition.balance = {
                    $regex: `${req.body.balance}`, $options: 'i'
                };
            }
            if (req.body.transfer) {
                condition.transfer = {
                    $regex: `${req.body.transfer}`, $options: 'i'
                };
            }
            if (req.body.amount) {
                condition.amount = {
                    $regex: `${req.body.amount}`, $options: 'i'
                };
            }
            if (req.body.createdBy) {
                condition["createdBy.userName"] = {
                    $regex: `${req.body.createdBy}`, $options: 'i'
                };
            }
            if (req.body.updatedAt) {
                const searchDate = moment(req.body.updatedAt).format('YYYY-MM-DD') + "T00:00:00.000";
                const searchGtDate = moment(req.body.updatedAt).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
                let value: any = {};
                value = {
                    '$lt': searchGtDate,
                    '$gte': searchDate
                };
                condition.updatedAt = value;
            }
            if (req.body.name) {
                condition["name.userName"] = {
                    $regex: `${req.body.name}`, $options: 'i'
                };
            }
        }
        await transfermongos.find(condition, { __v: 0 },
            async (err: any, data: any) => {
                if (data) {
                    const count: any = await transfermongos.count(condition);
                    const totalPages = Math.ceil(count / limitValue);
                    res.status(200).json({ data, totalPages });
                } else {
                    res.status(400).json("Cannot find data");
                }
            }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
    } catch (error) {
        res.status(500).json(error);
    }
};
export const transferAndWithdraw = async (req: Request, res: Response) => {
    await transfermongos.find({ email: req.body.decoded.email }, { balance: 1 });
    const num1: any = parseInt(req.body.balance);
    const num2: any = parseInt(req.body.amount);
    const total: any = num1 + num2;
    await transfermongos.findOne({ email: req.body.decoded.email }, async function (err: any, data: any) {
        if (err)
            throw err;
        else {
            if (data.balance > num1) {
                res.status(200).json({ msg: 'Balance is transfer' });
            }
            else {
                res.status(200).json({ msg: 'Balance is withdraw' });
            }
        }
    });
};


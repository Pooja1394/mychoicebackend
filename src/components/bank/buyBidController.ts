import express from 'express';
import { Request, Response, NextFunction } from 'express';
import BuyBidBuyBank from './transferModel';
import User from '../user/userModels';
import Admin from '../admin/admin.model';
import Bank from './bankModels';
import Bid from './bidModels';
import decoded from 'jwt-decode';
import constant from "../config/constant";
import { assertWithStatement } from 'babel-types';
import moment from 'moment-timezone';
import en from "../../../language/en";
import my from "../../../language/my";
import mongoose from 'mongoose';
import bidModels from './bidModels';
import { onlineUser } from '../../socket/websocket';
import { Types } from '../../socket/types';
import *as async from "async";
import { sendNotification } from '../notification/notifyControllers';
import deviceModel from "../notification/deviceModel";
export let createbuybank = async (req: Request, res: Response) => {
    try {
        const ip: any = req.headers['x-forwarded-for'];
        const userIp = ip.split(",")[0];
        const userData: any = await User.findOne({ email: req.body.decoded.email }, { userName: 1, loginType: 1, picture: 1, lang: 1, _id: 1, suspend: 1 });
        const bankData: any = await Bank.findOne({ _id: req.body.bankId }, { bankName: 1, picture: 1, bankShortName: 1 });
        const bidData: any = await bidModels.findOne({ _id: req.body.bidId }, { amount: 1, bidPackageName: 1, noOfBids: 1 });
        if (userData) {
            const buybid = new BuyBidBuyBank({
                userId: userData._id,
                email: req.body.decoded.email,
                suspend: userData.suspend,
                name: {
                    userName: userData.userName,
                    img: userData.picture,
                    ip: userIp,
                },
                loginType: userData.loginType,
                transferBy: "Bank",
                transfer: "",
                bidPackageName: bidData.bidPackageName,
                amount: bidData.noOfBids,
                totalAmt: bidData.amount,
                bankName: bankData.bankShortName,
                picture: bankData.picture,
                invoice: req.body.invoice,
                action: req.body.action,
                lang: req.body.lang,
            });
            await buybid.save();
            res.status(200).json({
                msg: userData.lang == "en" ? en.bids : my.bids
            });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
};

export let action = async (req: Request, res: Response) => {
    try {
        const ip: any = req.headers['x-forwarded-for'];
        const userIp: any = ip.split(',')[0];
        if (req.body.actionType == "Transfer") {
            const noOfBid: any = await BuyBidBuyBank.findOne((mongoose.Types.ObjectId(req.body.buyID)), { amount: 1, email: 1 });
            const bidTransfer: any = parseInt(noOfBid.amount);
            const userBalance: any = await User.findOne({ email: noOfBid.email }, { balance: 1, userName: 1 });
            const balance = parseInt(userBalance.balance);
            const totalBalance: any = balance + parseInt(bidTransfer);
            const updateBalance: any = await User.findOneAndUpdate({ email: noOfBid.email }, { $set: { "balance": totalBalance } }, { new: true });
            const adminData: any = await Admin.findOne({ email: req.body.decoded.email }, { password: 0 });
            const createdBy: any = {
                userName: adminData.userName,
                picture: adminData.picture,
                ip: userIp,
            };
            const actionData: any = await BuyBidBuyBank.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.buyID), { $set: { action: req.body.actionType, balance: updateBalance.balance, createdBy: createdBy, is_Active: true, transferBy: "Bank", transfer: "Transfer", transferAction: true } }, { new: true });
            deviceModel.findOne({ userId: req.body.userId }, async (err: any, notify: any) => {
                if (err) throw err;
                else {
                    let info = {};
                    let obj = {
                        title: 'new-transition',
                        notificationType: Types.CREATE_TRANSFER,
                        // type: Types.CREATE_TRANSFER,
                        content: { balance: totalBalance },
                        data: {
                            amount: totalBalance,
                            type: Types.CREATE_TRANSFER,
                        }
                    };
                    sendNotification(obj, info, notify.token, async (err: any, data: any) => {
                    });
                }
            });
            // let respondToUser = await onlineUser.filter((user: any) => user.userId == req.body.userId);
            // if (respondToUser.length > 0) {
            //     async.forEach(respondToUser, (userSession: any) => {
            //         userSession.ws.send(JSON.stringify({ 'type': Types.CREATE_TRANSFER, 'amount': noOfBid.amount }));
            //     });
            // }
            res.status(200).send({ actionData, updateBalance });
        }
        else if (req.body.actionType == "Reject") {
            const actionData = await BuyBidBuyBank.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.buyID), { $set: { action: req.body.actionType, is_Active: true, reject: true, transferBy: "Bank" } }, { new: true });
            res.status(200).json(actionData);
        }
        else {
            res.status(400).json("Not Found");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
};
export let filterBuyBid = async (req: Request, res: Response) => {
    let skip_Value;
    let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
    if (req.query.page != undefined && req.query.page > 1) {
        skip_Value = limitValue * (req.query.page - 1);
    } else { skip_Value = 0; }
    if (req.query.limit != undefined) {
        limitValue = parseInt(req.query.limit);
    }
    let condition: any = {};
    condition.is_Active = false;
    condition.transferBy = "Bank";
    if (req.body.userName) {
        condition["name.userName"] = {
            $regex: `${req.body.userName}`, $options: 'i'
        };
    }
    if (req.body.email) {
        condition.email = new RegExp('^' + req.body.email, "i");
    }
    if (req.body.loginType) {
        condition.loginType = new RegExp('^' + req.body.loginType, "i");
    }
    if (req.body.bidPackageName) {
        condition.bidPackageName = new RegExp('^' + req.body.bidPackageName, "i");
    }
    if (req.body.noOfBids) {
        condition.amount = new RegExp('^' + req.body.noOfBids, "i");
    }
    if (req.body.bankName) {
        condition.bankName = new RegExp('^' + req.body.bankName, "i");
    }
    if (req.body.invoice) {
        condition.invoice = new RegExp('^' + req.body.invoice, "i");
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
    try {
        const buyBidList = await BuyBidBuyBank.find(condition).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        const totalCount = await BuyBidBuyBank.count(condition);
        const totalPage = Math.ceil(totalCount / limitValue);
        res.status(200).json({ buyBidList, totalPage });
    }
    catch (error) {
        res.status(500).json(error);
    }
};

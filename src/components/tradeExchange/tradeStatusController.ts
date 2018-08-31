import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import tradeoutModel from './tradeoutModel';
import userModels from '../user/userModels';
import tradeoutPaymentModel from './tradeoutPaymentModel';
import tradeStatusModel from './tradeStatusModel';
import decoded from "jwt-decode";
import async from "async";
import { Response, Request, NextFunction } from 'express';
import { error } from 'util';
import moment from 'moment-timezone';
import _ from "lodash";
import productModels from '../product/productModels';

export const tradeStatusCreate = async (req: Request, res: Response) => {
    try {
        // const ip: any = req.headers['x-forwarded-for'];
        // let userIp: any;
        // if (ip) {
        //     userIp = ip.split(',')[0];
        //     console.log("ippppppppp.....", userIp);
        // } else {
        //     userIp = "no ip";
        // }
        const tradeStatusData: any = await tradeoutPaymentModel.findOne({ _id: req.body._id }, { productId: 1, productName: 1, image: 1, createdAt: 1, quantity: 1, winningPrice: 1, tradePrice: 1, serviceFee: 1, sellers: 1, buyers: 1 });
        const userData: any = await userModels.findOne({ _id: req.body.decoded._id }, { userName: 1, picture: 1, balance: 1 });

        console.log("tradeStatusData----->", tradeStatusData);
       // console.log("userData------>", userData);
        const allData: any = new tradeStatusModel({
            tradecreatedAt: tradeStatusData.tradecreatedAt,
            productId: tradeStatusData.productId,
            productName: tradeStatusData.productName,
            image: tradeStatusData.image,
            quantity: tradeStatusData.quantity,
            winningPrice: tradeStatusData.winningPrice,
            retailPrice: tradeStatusData.retailPrice,
            tradePrice: tradeStatusData.tradePrice,
            balance: tradeStatusData.balance,
            serviceFee: tradeStatusData.serviceFee,
            buyers: tradeStatusData.buyers,
            sellers: tradeStatusData.sellers
        });
        await allData.save();
        res.status(200).json(allData);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const filterTradeStatus = async (req: Request, res: Response) => {
    console.log('body in filter packg--->', req.body);
    let skip_Value;
    let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
    if (req.query.page != undefined && req.query.page > 1) {
        skip_Value = limitValue * (req.query.page - 1);
    } else { skip_Value = 0; }
    if (req.query.limit != undefined) {
        limitValue = parseInt(req.query.limit);
    }
    let condition: any = {};
    if (req.body.balance) {
        condition.balance = new RegExp('^' + req.body.balance, "i");
    }
    if (req.body.productName) {
        condition.productName = new RegExp('^' + req.body.productName, "i");
    }
    if (req.body.quantity) {
        condition.quantity = new RegExp('^' + req.body.quantity, "i");
    }
    if (req.body.winningPrice) {
        condition.winningPrice = new RegExp('^' + req.body.winningPrice, "i");
    }
    if (req.body.retailPrice) {
        condition.retailPrice = new RegExp('^' + req.body.retailPrice, "i");
    }
    if (req.body.tradePrice) {
        condition.tradePrice = new RegExp('^' + req.body.tradePrice, "i");
    }
    if (req.body.serviceFee) {
        condition.serviceFee = new RegExp('^' + req.body.serviceFee, "i");
    }
    if (req.body.userName) {
        condition = {
            "sellers.userName": new RegExp('^' + req.body.userName, "i"),
        };
    }
    if (req.body.userName) {
        condition = {
            "buyers.userName": new RegExp('^' + req.body.userName, "i"),
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
    if (req.body.tradecreatedAt) {
        const searchDate = moment(req.body.tradecreatedAt).format('YYYY-MM-DD') + "T00:00:00.000";
        const searchGtDate = moment(req.body.tradecreatedAt).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
        let value: any = {};
        value = {
            '$lt': searchGtDate,
            '$gte': searchDate
        };
        condition.tradecreatedAt = value;
    }
    try {
        console.log("filterTradeoutPayment condition Is==>", condition);
        const tradeStatus: any = await tradeStatusModel.find(condition).populate('tradeoutpaymentdetail').sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        // console.log("=======", auctionData);
        const totalCount = await tradeoutPaymentModel.count(condition);
        console.log("total count of tradepcakage is==>", totalCount);
        const totalPage = Math.ceil(totalCount / limitValue);
        console.log("total Page in tradepcakage filtered===>", totalPage);
        if (Object.keys(tradeStatus).length > 0) {
            res.status(200).json({ success: "true", tradeStatus, totalPage });
        } else {
            res.status(200).json({ success: false, tradeStatus });
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
};


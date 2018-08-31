// import express from 'express';
// import { Request, Response, NextFunction } from 'express';
// import Payment from './paymentModel';
// import BuyBidBuyBank from './transferModel';
// import Admin from '../admin/admin.model';
// import User from '../user/userModels';
// import Bank from './bankModels';
// import Bid from './bidModels';
// import Transfer from './transferModel';
// import decoded from 'jwt-decode';
// import constant from "../config/constant";
// import { assertWithStatement } from 'babel-types';
// import moment from 'moment-timezone';
// import en from "../../../language/en";
// import my from "../../../language/my";
// import mongoose from 'mongoose';
// import _ from "lodash";
// import * as async from "async";
// /**
//  * creat Payment Detail API.
//  */
// export let createPayment = async (req: Request, res: Response) => {
//     console.log('Req body in create Payment', req.body);
//     try {
//         console.log("In try");
//         const ip: any = req.headers['x-forwarded-for'];
//         const userIp = ip.split(",")[0];
//         // for (let i = 0; i < req.body.userId.length; i++) {
//         // console.log("userId inside for...", req.body.userId[i]);
//         const adminData: any = await Admin.findOne({ email: req.body.decoded.email }, { userName: 1, picture: 1, email: 1 });
//         console.log('AdminData====>', adminData);
//         async.forEachSeries(req.body.userId, async (element: any, cb) => {
//             let balance: any;
//             console.log("element data is--->", element);
//             const transferData: any = await User.findOne({ _id: element._id });
//             console.log('transfer Data..payment cont**', transferData);
//             if (element.amount >= 0) {
//                 const update: any = parseInt(transferData.balance);
//                 console.log("transferData----->", transferData.balance);
//                 console.log("userbalance===>", update, typeof update);
//                 const amount: any = parseInt(element.amount);
//                 console.log("transfer amount ===>", amount, typeof amount);
//                 balance = update + amount;
//                 console.log("total_balance===>", balance, typeof balance);
//             }
//             if (element.amount < 0) {
//                 const update: any = parseInt(transferData.balance);
//                 console.log("transferData----->", transferData.balance);
//                 console.log("userbalance===>", update, typeof update);
//                 const amount: any = parseInt(element.amount);
//                 console.log("transfer amount ===>", amount, typeof amount);
//                 balance = update - amount;
//                 console.log("total_balance===>", balance, typeof balance);
//             }
//             const userupdtBalance: any = await User.findOneAndUpdate({ _id: element._id }, { $set: { "balance": balance } });
//             // const userIP: any = await BuyBidBuyBank.findById({ userId: element._id }, { user: 1});
//             // console.log("Buybidbank user ip===>", userIP.user.ip);
//             const payment = new Payment({
//                 userId: element._id,
//                 user: {
//                     userName: transferData.userName,
//                     img: transferData.picture,
//                     ip: transferData.ipAddress,
//                 },
//                 email: transferData.email,
//                 loginType: transferData.loginType,
//                 amount: transferData.amount,
//                 balance: balance,
//                 transferType: element.action,
//                 createdBy: {
//                     adminName: adminData.userName,
//                     picture: adminData.picture,
//                     ip: userIp,
//                 }
//             });
//             console.log('payment saved data===>', payment);
//             cb();
//             await payment.save();
//             // res.status(200).json( payment);
//         });
//         // const payment = await Payment.find({}).lean();
//         res.status(200).json("ok");
//     }
//     catch (err) {
//         res.status(500).json(err);
//     }
// };
// /**
//  * Filtered Payment Detail API.
//  */
// export let paymentlist = async (req: Request, res: Response) => {
//     console.log('req.body in paymentlist Cont**', req.body);
//     let skip_Value;
//     let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
//     if (req.query.page != undefined && req.query.page > 1) {
//         skip_Value = limitValue * (req.query.page - 1);
//     } else { skip_Value = 0; }
//     if (req.query.limit != undefined) {
//         limitValue = parseInt(req.query.limit);
//     }
//     let condition: any = {};
//     if (req.body.userName) {
//         // condition.userName = new RegExp('^' + req.body.userName, "i");
//         condition = {
//             "user.userName": new RegExp('^' + req.body.userName, "i")
//         };
//     }
//     if (req.body.email) {
//         condition.email = new RegExp('^' + req.body.email, "i");
//     }
//     if (req.body.loginType) {
//         condition.loginType = new RegExp('^' + req.body.loginType, "i");
//     }
//     if (req.body.amount) {
//         condition.amount = new RegExp('^' + req.body.amount, "i");
//     }
//     if (req.body.transferType) {
//         condition.transferType = new RegExp('^' + req.body.transferType, "i");
//     }
//     if (req.body.transferType == "All") {
//         condition;
//     }
//     if (req.body.balance) {
//         condition.balance = new RegExp('^' + req.body.balance, "i");
//     }
//     if (req.body.balance) {
//         condition.balance = new RegExp('^' + req.body.balance, "i");
//     }
//     if (req.body.createdAt) {
//         const searchDate = moment(req.body.createdAt).format('YYYY-MM-DD') + "T00:00:00.000";
//         const searchGtDate = moment(req.body.createdAt).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
//         let value: any = {};
//         value = {
//             '$lt': searchGtDate,
//             '$gte': searchDate
//         };
//         condition.createdAt = value;
//     }
//     if (req.body.adminName) {
//         // condition.userName = new RegExp('^' + req.body.userName, "i");
//         condition = {
//             "user.adminName": new RegExp('^' + req.body.userName, "i")
//         };
//     }
//     console.log("filter payment condition Is==>", condition);
//     try {
//         // console.log("******", condition);

//         const paymentListData = await Payment.find(condition).sort({ createdAt: -1 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
//         // console.log("=======", auctionData);
//         const totalCount = await Payment.count(condition);
//         console.log("total count of payment is==>", totalCount);
//         const totalPage = Math.ceil(totalCount / limitValue);
//         console.log("total Page in payment filtered===>", totalPage);
//         if (Object.keys(paymentListData).length > 0) {
//             res.status(200).json({ paymentListData, totalPage });
//         } else {
//             res.status(200).json(paymentListData);
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

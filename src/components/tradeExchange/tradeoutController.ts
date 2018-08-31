import express, { json } from "express";
import jwt from "jsonwebtoken";
import tradeoutModel from "./tradeoutModel";
import userModels from "../user/userModels";
import admin from "../admin/admin.model";
import auctionModel from "../auction/auctionModel";
import decoded from "jwt-decode";
import async from "async";
import { Response, Request, NextFunction } from "express";
import { error } from "util";
import moment from "moment-timezone";
import _ from "lodash";
import productModels from "../product/productModels";

export const tradeoutCreate = async (req: Request, res: Response) => {
  try {
    const ip: any = req.headers["x-forwarded-for"];
    let userIp: any;
    if (ip) {
      userIp = ip.split(",")[0];
      console.log("ippppppppp.....", userIp);
    } else {
      userIp = "no ip";
    }
    const userData: any = await userModels.findOne(
      { _id: req.body.decoded._id },
      { userName: 1, picture: 1, balance: 1 }
    );
    const auctionData: any = await auctionModel.findOne(
      { _id: req.body._id },
      {
        retailPrice: 1,
        "products.productId": 1,
        "products.productName": 1,
        "products.image": 1
      }
    );
    console.log("auction products----->", auctionData);
    // console.log("UserData----->", userData);
    const allData: any = new tradeoutModel({
      balance: userData.balance,
      quantity: req.body.quantity,
      winningPrice: req.body.winningPrice,
      retailPrice: auctionData.retailPrice,
      tradePrice: req.body.tradePrice,
      serviceFee: req.body.serviceFee,
      productId: auctionData.products.productId,
      productName: auctionData.products.productName,
      image: auctionData.products.image,
      sellers: {
        userName: userData.userName,
        picture: userData.picture,
        ip: userIp
      },
      status: req.body.status
    });
    await allData.save();
    res.status(200).json(allData);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// export const tradeoutCreate = async (req: Request, res: Response) => {
//     try {
//         const userData: any = await userModels.findOne({ _id: req.body.decoded._id }, { userName: 1, picture: 1, balance: 1 });
//         // const auctionData: any = await Auction.findOne({ "_id": req.body.auctionData })
//         const allData: any = new tradeoutModel({
//             balance: userData.balance,
//             auctiondetail: req.body.auctiondetail,
//             quantity: req.body.quantity,
//             winningPrice: req.body.winningPrice,
//             sellers: {
//                 userName: userData.userName,
//                 picture: userData.picture
//             }
//         });
//         await allData.save();
//         res.status(200).json(allData);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json(error);
//     }
// };

export const filterTradeout = async (req: Request, res: Response) => {
  console.log("body in filter packg--->", req.body);
  let skip_Value;
  let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
  if (req.query.page != undefined && req.query.page > 1) {
    skip_Value = limitValue * (req.query.page - 1);
  } else {
    skip_Value = 0;
  }

  if (req.query.limit != undefined) {
    limitValue = parseInt(req.query.limit);
  }
  let condition: any = {};
  if (req.body.type == "tradeout") {
    console.log('tradeout');
    condition.status = "request";
  } else if (req.body.type == "payment") {
    condition.status = "payment";
  } else if (req.body.type == "tradestatus") {
    condition.status = "paid";
  }
  else {
    console.log("in else of type");
  }
  if (req.body.balance) {
    condition.balance = new RegExp("^" + req.body.balance, "i");
  }
  if (req.body.quantity) {
    condition.quantity = new RegExp("^" + req.body.quantity, "i");
  }
  if (req.body.winningPrice) {
    condition.winningPrice = new RegExp("^" + req.body.winningPrice, "i");
  }
  if (req.body.retailPrice) {
    condition.retailPrice = new RegExp("^" + req.body.retailPrice, "i");
  }
  if (req.body.tradePrice) {
    condition.tradePrice = new RegExp("^" + req.body.tradePrice, "i");
  }
  if (req.body.serviceFee) {
    condition.serviceFee = new RegExp("^" + req.body.serviceFee, "i");
  }
  if (req.body.productName) {
    condition.productName = new RegExp("^" + req.body.productName, "i");
  }
  if (req.body.sellers) {
    let userName = new RegExp("^" + req.body.sellers, "i");
    condition["sellers.userName"] = userName;
  }
  if (req.body.buyers) {
    let userName = new RegExp("^" + req.body.buyers, "i");
    condition["buyers.userName"] = userName;
  }
  console.log("sellerts------->", condition);
  if (req.body.createdAt) {
    const searchDate =
      moment(req.body.createdAt).format("YYYY-MM-DD") + "T00:00:00.000";
    const searchGtDate =
      moment(req.body.createdAt)
        .add(1, "d")
        .format("YYYY-MM-DD") + "T00:00:00.000";
    let value: any = {};
    value = {
      $lt: searchGtDate,
      $gte: searchDate
    };
    condition.createdAt = value;
  }
  if (req.body.updatedAt) {
    const searchDate =
      moment(req.body.updatedAt).format("YYYY-MM-DD") + "T00:00:00.000";
    const searchGtDate =
      moment(req.body.updatedAt)
        .add(1, "d")
        .format("YYYY-MM-DD") + "T00:00:00.000";
    let value: any = {};
    value = {
      $lt: searchGtDate,
      $gte: searchDate
    };
    condition.updatedAt = value;
  }
  try {
    console.log("filtertradeout condition Is==>", condition);
    const tradeoutData: any = await tradeoutModel
      .find(condition)
      .populate("auctiondetail", "products retailPrice")
      .sort({ createdAt: -1 })
      .skip(skip_Value)
      .limit(limitValue);
    // console.log("=======", tradeoutData);
    const totalCount = await tradeoutModel.count(condition);
    console.log("total count of tradepcakage is==>", totalCount);
    const totalPage = Math.ceil(totalCount / limitValue);
    console.log("total Page in tradepcakage filtered===>", totalPage);
    if (Object.keys(tradeoutData).length > 0) {
      res.status(200).json({ success: "true", tradeoutData, totalPage });
    } else {
      res.status(200).json({ success: false, tradeoutData });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
export const acceptTradeOut = async (req: Request, res: Response) => {
  try {
    let arr: any = [];
    async.forEach(
      req.body.ids,
      async (element: any, cb) => {
        console.log("data = ", element);
        await tradeoutModel.findOneAndUpdate(
          { _id: element },
          {
            $set: {
              status: "accept"
            }
          },
          { new: true },
          (err: any, data: any) => {
            if (data) {
              const _result = data.toJSON();
              console.log("data = ", _result);
              const obj = {
                balance: _result.balance,
                quantity: _result.quantity,
                winningPrice: _result.winningPrice,
                retailPrice: _result.retailPrice,
                tradePrice: _result.tradePrice,
                serviceFee: _result.serviceFee,
                productId: _result.productId,
                productName: _result.productName,
                image: _result.image,
                sellers: _result.sellers,
                status: _result.status
              };
              arr.push(obj);
              cb();
            }
            else {
              cb();
            }
          }
        );
      },
      err => {
        res.status(200).json({ msg: "Accepted", data: arr });
      }
    );
  } catch (err) {
    console.log("Error Found");
    res.status(500).json(err);
  }
};
export const paidTradeOut = async (req: Request, res: Response) => {
  try {
    let arr: any = [];
    async.forEach(
      req.body.ids,
      async (element: any, cb) => {
        console.log("data = ", element);
        await tradeoutModel.findOneAndUpdate(
          { _id: element },
          {
            $set: {
              status: "paid"
            }
          },
          { new: true },
          (err: any, data: any) => {
            if (data) {
              const _result = data.toJSON();
              console.log("data = ", _result);
              const obj = {
                balance: _result.balance,
                quantity: _result.quantity,
                winningPrice: _result.winningPrice,
                retailPrice: _result.retailPrice,
                tradePrice: _result.tradePrice,
                serviceFee: _result.serviceFee,
                productId: _result.productId,
                productName: _result.productName,
                image: _result.image,
                sellers: _result.sellers,
                status: _result.status
              };
              arr.push(obj);
              cb();
            } else {
              cb();
            }
          }
        );
      },
      err => {
        res.status(200).json({ msg: "Accepted", data: arr });
      }
    );
  } catch (err) {
    console.log("Error Found");
    res.status(500).json(err);
  }
};
export const buyTradeOut = async (req: Request, res: Response) => {
  try {
    const ip: any = req.headers["x-forwarded-for"];
    let userIp: any;
    if (ip) {
      userIp = ip.split(",")[0];
      console.log("ippppppppp.....", userIp);
    } else {
      userIp = "no ip";
    }
    let arr: any = [];
    async.forEach(
      req.body.ids,
      async (element: any, cb) => {
        console.log("data = ", element);
        const adminData: any = await admin.findOne(
          { _id: req.body.decoded._id },
          { userName: 1, picture: 1, _id: 0 }
        );
        console.log("hello", adminData);
        await tradeoutModel.findOneAndUpdate(
          { _id: element },
          {
            $set: {
              status: "payment",
              buyers: {
                userName: adminData.userName,
                picture: adminData.picture,
                ip: userIp
              }
            }
          },
          { new: true },
          (err: any, data: any) => {
            if (data) {
              const _result = data.toJSON();
              // console.log('data = ', _result)
              const obj = {
                balance: _result.balance,
                quantity: _result.quantity,
                winningPrice: _result.winningPrice,
                retailPrice: _result.retailPrice,
                tradePrice: _result.tradePrice,
                serviceFee: _result.serviceFee,
                productId: _result.productId,
                productName: _result.productName,
                image: _result.image,
                sellers: _result.sellers,
                status: _result.status,
                buyers: _result.buyers
              };
              arr.push(obj);
              cb();
            } else {
              cb();
            }
          }
        );
      },
      err => {
        res.status(200).json({ msg: "Accepted", data: arr });
      }
    );
  } catch (err) {
    console.log("Error Found");
    res.status(500).json(err);
  }
};

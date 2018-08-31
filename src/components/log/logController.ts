import express, { json } from "express";
import jwt from "jsonwebtoken";
import userModels from "../user/userModels";
import logModels from "./logModel";
import admin from "../admin/admin.model";
import auctionModel from "../auction/auctionModel";
import decoded from "jwt-decode";
import async from "async";
import { Response, Request, NextFunction } from "express";
import { error } from "util";
import moment from "moment-timezone";
import _ from "lodash";
import productModels from "../product/productModels";

export const logsCreate = async (req: Request, res: Response) => {
  try {
    const ip: any = req.headers["x-forwarded-for"];
    let userIp: any;
    if (ip) {
      userIp = ip.split(",")[0];
      console.log("ippppppppp.....", userIp);
    } else {
      userIp = "no ip";
    }
    const userData: any = await userModels.findOne({ _id: req.body._id },
      {
        userName: 1,
        picture: 1,
        createdBy: 1,
        email: 1,
        _id: 1
      });
    console.log("userData----->", userData);
    const logData: any = new logModels({
      userId: userData._id,
      users: {
        userName: userData.userName,
        picture: userData.picture,
        ip: userIp
      },
      email: userData.email,
      ip: userIp,
      userType: userData.createdBy,
      objectType: req.body.objectType,
      activities: req.body.activities
    });
    console.log("log DAta----->", logData);
    await logData.save();
    res.status(200).json(logData);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const filterLogs = async (req: Request, res: Response) => {
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
  if (req.body.userName) {
    condition = {
      "users.userName": new RegExp('^' + req.body.userName, "i"),
    };
  }
  if (req.body.email) {
    condition.email = new RegExp("^" + req.body.email, "i");
  }
  if (req.body.userType) {
    condition.userType = new RegExp("^" + req.body.userType, "i");
  }
  if (req.body.objectType) {
    condition.objectType = new RegExp("^" + req.body.objectType, "i");
  }
  if (req.body.activities) {
    condition.activities = new RegExp("^" + req.body.activities, "i");
  }
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
  try {
    const logModelData: any = await logModels
      .find(condition)
      .populate("auctiondetail", "products retailPrice")
      .sort({ createdAt: -1 })
      .skip(skip_Value)
      .limit(limitValue);
    const totalCount = await logModels.count(condition);
    const totalPage = Math.ceil(totalCount / limitValue);
    if (Object.keys(logModelData).length > 0) {
      res.status(200).json({ success: "true", logModelData, totalPage });
    } else {
      res.status(200).json({ success: false, logModelData });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
export const getUserData = async (req: Request, res: Response) => {
  try {
    await userModels.find({}, { __v: 0 },
      (err: any, data: any) => {
        console.log(`user:----`, err, data);
        if (data) {
          res.json(data);
        } else if (err) {
          res.status(500).json({ err: err });
        }
      });
  } catch (error) {
    console.log("Error Found");
    res.status(400).json(error);
  }
};
import express from "express";
import deliverymongo from "./deliveryModels";
import userModels from "../user/userModels";
import auctionModel from "../auction/auctionModel";
import admin from '../admin/admin.model';
import employeemodel from "../employee/EmployeeModel";
import ordermodel from "./orderModel";
import carriermongo from "./carrierModel";
import servicemongo from "./serviceModel";
import bcrypt from "bcryptjs";
import axios from "axios";
import decoded from "jwt-decode";
import multer from "multer";
import moment from "moment-timezone";
import path from "path";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import async from "async";
export const jwt_secret = "ADIOS AMIGOS";
import mongoose from "mongoose";
import { Response, Request, NextFunction } from "express";
import { json } from "body-parser";
// import * as  xlsxtojson  from "xls-to-json";
import fs from "fs";
import orderModel from "./orderModel";
const app = express();
const xlsxtojson = require("xls-to-json");

export const updateDeliveryCost = async (req: Request, res: Response) => {
  //    const exceltojson, extension, fileExtension;
  const storage = multer.diskStorage({
    // multers disk storage settings
    destination: function (req, file, cb: any) {
      cb(undefined, "src/public/excl");
    },
    filename: (req, file, cb: any) => {
      console.log("filename", file.fieldname);
      const datetimestamp = Date.now();
      const d = new Date();
      const curr_date = d.getDate();
      const curr_month = d.getMonth();
      const curr_year = d.getFullYear();
      const date = curr_date + "-" + curr_month + "-" + curr_year;
      const time = d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();
      cb(
        undefined, file.fieldname + "-" + date + "-" + time + "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
      );
    }
  });
  const upload = multer({
    // multer settings
    storage: storage,
    fileFilter: function (req, file, callback: any) {
      // file filter
      console.log("file information", file);
      if (
        ["xls", "xlsx"].indexOf(
          file.originalname.split(".")[file.originalname.split(".").length - 1]
        ) === -1
      ) {
        return callback(new Error("Wrong extension type"));
      }
      callback(undefined, true);
    }
  }).single("file");
  upload(req, res, function (err) {
    console.log("err in uploading file", err);
    //    console.log("req",req)
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    if (!req.file) {
      res.json({ error_code: 1, err_desc: "No file passed" });
      return;
    }
    console.log("path", req.file.path);
    try {
      console.log("entering try", typeof req.file.path);
      xlsxtojson(
        {
          input: req.file.path,
          output: "", // since we don't need output.json
          lowerCaseHeaders: true
        },
        (err: any, result: any) => {
          if (err) {
            console.log("entering try error", err, result);
            return res.json({ error_code: 1, err_desc: err, data: undefined });
          } else {
            console.log("xcel data********", result);
            res.status(200).json(result);
          }
        }
      );
    } catch (error) {
      res.json({ error_code: 1, err_desc: error });
    }
    try {
      fs.unlinkSync(req.file.path);
    } catch (Error) {
      // error deleting the file
      console.log("in catch");
    }
  });
};
export const insertDeliveryData = async (req: Request, res: Response) => {
  const obj = req.body;
  const delivery = new deliverymongo(obj);
  delivery.save((err: any, data: any) => {
    if (err) {
      res.status(400).json({
        msg: "Error while Inserting Data"
      });
    }
    else {
      res.status(200).json({ msg: "Successfully Inserted Data" });
    }
  });
};
export const getDeliveryData = async (req: Request, res: Response) => {
  try {
    await deliverymongo.find({}, { _id: 0, __v: 0 },
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
export const addcarrier: any = (req: Request, res: Response) => {
  if (req.body.carrierName) {
    carriermongo.findOne({ carrierName: req.body.carrierName },
      async (err: any, result: any) => {
        console.log("result ---->", result);
        if (err) {
          res.status(500).json(err);
        }
        else if (result) {
          console.log('in else result');
          res.status(400).json({
            msg: "Carrier name Already exist"
          });
        }
        else {
          const ip: any = req.headers['x-forwarded-for'];
          const userIp = ip.split(",")[0];
          const adminData: any = await admin.findById(mongoose.Types.ObjectId(req.body.decoded._id));
          const user = new carriermongo({
            carrierName: req.body.carrierName,
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
                carrierName: data.carrierName,
                createdBy: data.createdBy,
                msg: "Carrier Name added successfully",
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
export const getCarrierName = async (req: Request, res: Response) => {
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
    if (req.body.carrierName) {
      condition.carrierName = { $regex: `${req.body.carrierName}`, $options: 'i' };
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
    await carriermongo.find(condition, { __v: 0 },
      async (err, data: any) => {
        console.log(`user:----`, err, data);
        if (data) {
          const count: any = await carriermongo.count(condition);
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
  } catch (Error) {
    console.log("Error Found");
    res.status(500).json(Error);
  }
};

export let deliveryService = async (req: Request, res: Response) => {
  try {
    const deliveryService = new servicemongo({
      carrierName: req.body.carrierName,
      _state: req.body._state,
      township: req.body.township,
      division: req.body._state,
      townShip: req.body.township,
      shippingDate: req.body.shippingDate,
      offAddress: req.body.offAddress,
      deliveryFee: req.body.deliveryFee,
      status: req.body.status,
    });
    await deliveryService.save();
    res.status(200).json("Success");
  }

  catch (error) {
    res.status(500).json(error);
  }
};
export const getcarrier = async (req: Request, res: Response) => {
  try {
    await carriermongo.find({}, { __v: 0, createdAt: 0, updatedAt: 0, createdBy: 0 },
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
export const getService = async (req: Request, res: Response) => {
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
    if (req.body.carrierName) {
      condition.carrierName = { $regex: `${req.body.carrierName}`, $options: 'i' };
      // condition.bankName = new RegExp('^' + req.body.bankName, "i");
    }
    if (req.body.shippingDate) {
      condition.shippingDate = { $regex: `${req.body.shippingDate}`, $options: 'i' };
      // new RegExp('^' + req.body.bankShortName, "i");
    }
    if (req.body.deliveryFee) {
      condition.deliveryFee = { $regex: `${req.body.deliveryFee}`, $options: 'i' };
      // new RegExp('^' + req.body.bankShortName, "i");
    }
    if (req.body.offAddress) {
      condition.offAddress = { $regex: `${req.body.offAddress}`, $options: 'i' };
      // new RegExp('^' + req.body.bankShortName, "i");
    }
    if (req.body.status) {
      condition.status = { $regex: `${req.body.status}`, $options: 'i' };
    }
    if (req.body._state) {
      condition._state = { $regex: `${req.body._state}`, $options: 'i' };
    }
    if (req.body.townShip) {
      condition.townShip = { $regex: `${req.body.townShip}`, $options: 'i' };
    }
    if (req.body.township) {
      condition.township = { $regex: `${req.body.township}`, $options: 'i' };
    }
    if (req.body.division) {
      condition.division = { $regex: `${req.body.division}`, $options: 'i' };
    }
    console.log(" ---- ", condition);
    await servicemongo.find(condition, { __v: 0 },
      async (err, data: any) => {
        console.log(`user:----`, err, data);
        if (data) {
          const count: any = await servicemongo.count(condition);
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
  } catch (Error) {
    console.log("Error Found");
    res.status(500).json(Error);
  }
};
export const orderprocessing = async (req: Request, res: Response) => {
  try {
    const ip: any = req.headers['x-forwarded-for'];
    const userIp = ip.split(",")[0];
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
    console.log("auction products----->", auctionData, auctionData.products.productId);
    // console.log("UserData----->", userData);
    if (req.body.coupon === "") {
      const allData: any = new ordermodel({
        quantity: req.body.quantity,
        orderType: req.body.orderType,
        retailPrice: auctionData.retailPrice,
        shippingCharge: req.body.shippingCharge,
        totalPrice: auctionData.retailPrice + req.body.shippingCharge,
        productId: auctionData.products.productId,
        productName: auctionData.products.productName,
        image: auctionData.products.image,
        user: {
          userName: userData.userName,
          picture: userData.picture,
          ip: userIp
        },
        promotion: auctionData.promotion,
        coupon: req.body.coupon,
        employee: req.body.employee,
        status: req.body.status
      });

      await allData.save();
      res.status(200).json(allData);
    }
    else {
      const allData: any = new ordermodel({
        quantity: req.body.quantity,
        orderType: req.body.orderType,
        retailPrice: auctionData.retailPrice,
        shippingCharge: req.body.shippingCharge,
        totalPrice: auctionData.retailPrice + req.body.shippingCharge - 500,
        productId: auctionData.products.productId,
        productName: auctionData.products.productName,
        image: auctionData.products.image,
        user: {
          userName: userData.userName,
          picture: userData.picture,
          ip: userIp
        },
        promotion: req.body.promotion,
        coupon: req.body.coupon,
        employee: req.body.employee,
        status: req.body.status

      });

      await allData.save();
      res.status(200).json(allData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const getorderdata = async (req: Request, res: Response) => {
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
    if (req.body.status == "") {
      condition.status = { $regex: `${req.body.status}`, $options: 'i' };
    }
    if (req.body.status == "Accept") {
      condition.status = { $regex: `${req.body.status}`, $options: 'i' };
    }
    if (req.body.status == "Assign") {
      condition.status = { $regex: `${req.body.status}`, $options: 'i' };
    }
    if (req.body.quantity) {
      condition.quantity = { $regex: `${req.body.quantity}`, $options: 'i' };
      // condition.bankName = new RegExp('^' + req.body.bankName, "i");
    }
    if (req.body.quantity) {
      condition.quantity = { $regex: `${req.body.quantity}`, $options: 'i' };
      // new RegExp('^' + req.body.bankShortName, "i");
    }
    if (req.body.retailPrice) {
      condition.retailPrice = { $regex: `${req.body.retailPrice}`, $options: 'i' };
      // new RegExp('^' + req.body.bankShortName, "i");
    }
    if (req.body.offAddress) {
      condition.offAddress = { $regex: `${req.body.offAddress}`, $options: 'i' };
      // new RegExp('^' + req.body.bankShortName, "i");
    }
    if (req.body.shippingCharge) {
      condition.shippingCharge = { $regex: `${req.body.shippingCharge}`, $options: 'i' };
    }
    if (req.body.totalPrice) {
      condition.totalPrice = { $regex: `${req.body.totalPrice}`, $options: 'i' };
    }
    if (req.body.totalPrice) {
      condition.totalPrice = { $regex: `${req.body.totalPrice}`, $options: 'i' };
    }
    if (req.body.productId) {
      condition.productId = { $regex: `${req.body.productId}`, $options: 'i' };
    }
    if (req.body.productName) {
      condition.productName = { $regex: `${req.body.productName}`, $options: 'i' };
    }
    if (req.body.user) {
      condition["user.userName"] = {
        $regex: `${req.body.user}`, $options: 'i'
      };
    }
    console.log(" ---- ", condition);
    await ordermodel.find(condition, { __v: 0 },
      async (err, data: any) => {
        console.log(`user:----`, err, data);
        if (data) {
          const count: any = await ordermodel.count(condition);
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
  } catch (Error) {
    console.log("Error Found");
    res.status(500).json(Error);
  }
};
export const getemployee = async (req: Request, res: Response) => {
  try {
    await employeemodel.find({}, {
      __v: 0, createdAt: 0, updatedAt: 0, createdBy: 0, EmployeeId: 0, Designation: 0,
      Department: 0, Privileges: 0, email: 0, Address: 0, TownShip: 0,
      DivisionORstate: 0, phoneNo1: 0, phoneNo2: 0, status: 0
    },
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
export const acceptOrder = async (req: Request, res: Response) => {
  try {
    let arr: any = [];
    async.forEach(req.body.ids, async (element: any, cb) => {
      console.log("data = ", element);
      await orderModel.findOneAndUpdate({ _id: element }, {
        $set: { status: "Accept" }
      },
        { new: true },
        (err: any, data: any) => {
          if (data) {
            const _result = data.toJSON();
            console.log("data = ", _result);
            console.log("id -------->", _result.productId);

            const obj = {
              quantity: _result.quantity,
              orderType: _result.orderType,
              retailPrice: _result.retailPrice,
              shippingCharge: _result.shippingCharge,
              totalPrice: _result.totalPrice,
              productId: _result.productId,
              productName: _result.productName,
              image: _result.image,
              user: _result.user,
              promotion: _result.promotion,
              coupon: _result.coupon,
              employee: _result.employee,
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
        res.status(200).json({ msg: "Accepted" });
      }
    );
  } catch (err) {
    console.log("Error Found");
    res.status(500).json(err);
  }
};
export const assignOrder = async (req: Request, res: Response) => {
  try {
    let arr: any = [];
    async.forEach(req.body.ids, async (element: any, cb) => {
      console.log("data = ", element);
      await orderModel.findOneAndUpdate({ _id: element }, {
        $set: { status: "Assign" }
      },
        { new: true },
        (err: any, data: any) => {
          if (data) {
            const _result = data.toJSON();
            console.log("data = ", _result);
            const obj = {
              quantity: _result.quantity,
              orderType: _result.orderType,
              retailPrice: _result.retailPrice,
              shippingCharge: _result.shippingCharge,
              totalPrice: _result.totalPrice,
              productId: _result.productId,
              productName: _result.productName,
              image: _result.image,
              user: _result.user,
              promotion: _result.promotion,
              coupon: _result.coupon,
              employee: _result.employee,
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
        res.status(200).json({ msg: "Assigned" });
      }
    );
  } catch (err) {
    console.log("Error Found");
    res.status(500).json(err);
  }
};
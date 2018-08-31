import espress from "express";
import transfermongos from "../bank/transferModel";
import { Request, Response, NextFunction } from 'express';
import userModels from "../user/userModels";
import mongoose from 'mongoose';
import settingmongo from './settingModel';
import constant from "../config/constant";

export const settings = async (req: Request, res: Response) => {
  const obj = req.body;
  const setting = new settingmongo(obj);
  setting.save((err: any, data: any) => {
    if (err) {
      res.status(400).json({
        msg: "Error"
      });
    }
    else {
      res.status(200).json({ msg: "Successfull" });
    }
  });
};
export const getSetting = async (req: Request, res: Response) => {
  try {
    await settingmongo.find({}, { _id: 0, __v: 0 },
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

export const updateSetting = async (req: Request, res: Response) => {
  console.log("userName = ", req.body.userName);
  try {
    await settingmongo.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          bidExchange: req.body.bidExchange,
          bidSellingPrice: req.body.bidSellingPrice,
          timeIncrement: req.body.timeIncrement,
          priceIncrement: req.body.priceIncrement
        }
      }, { new: true }, (err, data: any) => {
        console.log(`user:----`, data);
        if (data) {
          const _result = data.toJSON();
          const obj = {
            bidExchange: _result.bidExchange,
            bidSellingPrice: _result.bidSellingPrice,
            msg: "Updated"

          };
          res.json(obj);
        }
        else {
          res.status(400).json({ msg: "No Data Found" });
        }
      });
  } catch (error) {
    console.log("Error Found");
    res.status(400).json(error);
  }
};


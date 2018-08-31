import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../user/userModels';
import transferModel from '../bank/transferModel';
import tradeoutModel from '../tradeExchange/tradeoutModel';
import async from "async";
import { Response, Request, NextFunction } from 'express';
import { error } from 'util';
import moment from 'moment-timezone';
import _ from "lodash";
import { parse } from 'querystring';

export const depositCreate = async (req: Request, res: Response) => {
  try {
    let limit: any = 10;
    let page: any = 1;
    let skip: any = 0;
    if (req.query.page) {
      page = parseInt(req.query.page);
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }
    if (page > 1) {
      skip = (page - 1) * limit;
    }
    let transferData: any = [];

    if (req.body.startDate && req.body.endDate) {

      let stratSplitDate = req.body.startDate.split('-');
      let endSplitDate = req.body.endDate.split('-');

      console.log(stratSplitDate, endSplitDate);

      let startDate = new Date(stratSplitDate[2], stratSplitDate[1], stratSplitDate[0], 5, 31, 0, 0);

      let endDate = new Date(endSplitDate[2], endSplitDate[1], endSplitDate[0], 23, 59, 59, 0);
      console.log(startDate, endDate);
      transferData = await transferModel.find({
        createdAt: {
          '$gte': startDate,
          '$lte': endDate
        }
      }
        , { email: 1, transfer: 1, withdraw: 1, amount: 1, createdAt: 1 });
    } else if (req.body.days) {
      let days = parseInt(req.body.days);
      let to = new Date();
      let from = new Date();
      from.setDate(from.getDate() - days);
      transferData = await transferModel.find({
        'createdAt': {
          '$gte': from,
          '$lte': to
        }
      }
        , { email: 1, transfer: 1, withdraw: 1, amount: 1, createdAt: 1 });
    } else {
      transferData = await transferModel.find({},
        { email: 1, transfer: 1, withdraw: 1, amount: 1, createdAt: 1 });
    }

    let resultData = _.groupBy(transferData, function (el: any) {
      return (el.createdAt.getDate() + '/') + (el.createdAt.getMonth() + '/') + (el.createdAt.getFullYear());
    });
    let finalResult: any = [];
    _.forIn(resultData, function (value: any, key: any) {
      let transfer = 0, withdraw = 0;
      _.forEach(value, (element: any) => {
        if (element.transfer === 'Transfer') {
          transfer += parseInt(element.amount);
        } else {
          withdraw += parseInt(element.amount);
        }
      });

      finalResult = finalResult.concat({
        date: key,
        users: value.length,
        transfer: transfer,
        withdraw: withdraw,
        profit: transfer - withdraw
      });
    });
    res.status(200).json({
      "page": Math.ceil(finalResult.length / limit),
      "finalResult": _.reverse(finalResult).slice(skip, (skip + limit))
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const tradeDetails = async (req: Request, res: Response) => {
  try {
    let limit: any = 2;
    let page: any = 1;
    let skip: any = 0;
    if (req.query.page) {
      page = parseInt(req.query.page);
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }
    if (page > 1) {
      skip = (page - 1) * limit;
    }

    let transferData: any = [];

    if (req.body.startDate && req.body.endDate) {

      let stratSplitDate = req.body.startDate.split('-');
      let endSplitDate = req.body.endDate.split('-');

      console.log(stratSplitDate, endSplitDate);

      let startDate = new Date(stratSplitDate[2], stratSplitDate[1], stratSplitDate[0], 5, 31, 0, 0);

      let endDate = new Date(endSplitDate[2], endSplitDate[1], endSplitDate[0], 23, 59, 59, 0);
      console.log(startDate, endDate);
      transferData = await tradeoutModel.find({
        createdAt: {
          '$gte': startDate,
          '$lte': endDate
        }
      }
        , { productName: 1, quantity: 1, retailPrice: 1, tradePrice: 1, createdAt: 1, sreviceFee: 1 });
    } else if (req.body.days) {
      let days = parseInt(req.body.days);
      let to = new Date();
      let from = new Date();
      from.setDate(from.getDate() - days);
      transferData = await tradeoutModel.find({
        'createdAt': {
          '$gte': from,
          '$lte': to
        }
      }
        , { productName: 1, quantity: 1, retailPrice: 1, tradePrice: 1, createdAt: 1, sreviceFee: 1 });
    } else {
      transferData = await tradeoutModel.find({},
        { productName: 1, quantity: 1, retailPrice: 1, tradePrice: 1, createdAt: 1, sreviceFee: 1 });
    }
    let resultData = _.groupBy(transferData, function (el) {
      return (el.createdAt.getDate() + '/') + (el.createdAt.getMonth() + '/') + (el.createdAt.getFullYear());
    });

    let finalResult: any = [];
    let retailPrice = 0, tradePrice = 0, percentage = 0;
    _.forIn(resultData, function (value, key) {
      _.forEach(value, (element) => {
        retailPrice += parseInt(element.retailPrice);
        tradePrice += parseInt(element.tradePrice);
      });
      finalResult = finalResult.concat({
        date: key,
        products: value.length,
        retailPrice: retailPrice,
        tradePrice: tradePrice,
        percentage: parseFloat((retailPrice / tradePrice * 100).toFixed(2)),
        sreviceFee: retailPrice - tradePrice,
      });
    });
    res.status(200).json({
      "page": Math.ceil(finalResult.length / limit),
      "finalResult": _.reverse(finalResult).slice(skip, (skip + limit))
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


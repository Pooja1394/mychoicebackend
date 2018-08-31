import express, { json } from 'express';
import packageModel from './packageModel';
import review from './reviewModel';
import permission from './packagePermissionModel';
import prodect from '../product/productModels';
import admin from '../admin/admin.model';
import jwt from 'jsonwebtoken';
import decoded from "jwt-decode";
import async from "async";
export const jwt_secret = "jangan";
import { Response, Request, NextFunction } from 'express';
import { error } from 'util';
import multer from 'multer';
import path from 'path';
import mongoose from 'mongoose';
import fs from 'fs';
import _ from "lodash";
import productModels from '../product/productModels';
import { createPackage } from './packageController';
import moment from 'moment-timezone';


export const createReviewPackage = async (req: Request, res: Response) => {
    let packageValue: any = [];
    try {
        const ip: any = req.headers['x-forwarded-for'];
        let userIp: any;
        if (ip) {
            userIp = ip.split(',')[0];
            console.log("ippppppppp.....", userIp);
        } else {
            userIp = "no ip";
        }
        const packageData: any = await packageModel.findOne({ _id: req.body.packageID }, { packageName: 1, review: 1 }); {
            const adminData: any = await admin.findOne({ email: req.body.decoded.email }, { userName: 1, picture: 1 });
            console.log("packshck", packageData);
            await async.forEach(req.body.products, async (elements: any, cb2) => {
                const productData: any = await prodect.findOne({ _id: elements }, { productNameEn: 1, image: 1 });
                const allData = new permission({
                    packageName: packageData.packageName,
                    packageID: packageData._id,
                    review: packageData.review,
                    productID: productData._id,
                    productNameEn: productData.productNameEn,
                    image: productData.image,
                    createdBy: {
                        name: adminData.userName,
                        image: adminData.picture,
                        ip: userIp
                    },
                });
                console.log('.....allData......', allData);
                await allData.save();
            });
            res.status(200).json({ success: true });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const filterPackageReview = async (req: Request, res: Response) => {
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
    if (req.body.packageName) {
        condition.packageName = new RegExp('^' + req.body.packageName, "i");
    }
    if (req.body.productNameEn) {
        condition.productNameEn = new RegExp('^' + req.body.productNameEn, "i");
    }
    if (req.body.name) {
        condition = {
            "createdBy.name": new RegExp('^' + req.body.name, "i"),
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
    try {
        console.log("filterpckgreview condition Is==>", condition);
        const reviewPckgData: any = await permission.find(condition).sort({ createdAt: -1 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        // console.log("=======", auctionData);
        const totalCount = await permission.count(condition);
        console.log("total count of reviewpackg is==>", totalCount);
        const totalPage = Math.ceil(totalCount / limitValue);
        console.log("total Page in reviewpackg filtered===>", totalPage);
        if (Object.keys(reviewPckgData).length > 0) {
            res.status(200).json({ success: "true", reviewPckgData, totalPage });
        } else {
            res.status(200).json({ success: false, reviewPckgData });
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
};
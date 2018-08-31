import express, { json } from 'express';
import packagemongo from './packageModel';
import reviewmongo from './reviewModel';
import admin from '../admin/admin.model';
import bcrypt from 'bcryptjs';
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

// export const createPackage = async (req: Request, res: Response) => {
//     try {
//         const reviewData: any = await reviewmongo.find({ _id: req.body._id }, { reviewName: 1 });
//         const user = new packagemongo({
//             packageName: req.body.packageName,
//             review: reviewData
//         });
//         const result: any = await user.save();
//         if (result) {
//              await result.save();
//             const _result = result.toJSON();
//             const obj = {
//                 packageName: _result.packageName,
//                 _id: _result._id,
//                 review: _result.review
//             };
//             res.status(200).send(obj);
//         }

//     } catch (error) {
//         console.log("error", error);
//         res.status(500).send({ error: error });
//     }
// };

export const createPackage = async (req: Request, res: Response) => {
    try {
        const ip: any = req.headers['x-forworded-for'];
        const userIp = ip.split(',')[0];
        const reviewAdd = req.body.reviewName;
        const reviewData: any = await reviewmongo.find({ _id: req.body._id }, { reviewName: 1 });
        const adminData: any = await admin.findById(mongoose.Types.ObjectId(req.body.decoded._id));
        if (reviewData.length) reviewData[0].reviewName.push(reviewAdd);
        const user = new packagemongo({
            packageName: req.body.packageName,
            status: req.body.status,
            review: reviewData,
            createdBy: {
                name: adminData.userName,
                img: adminData.picture,
                ip: userIp
            }
        });



        const result: any = await user.save();
        if (result) {
            result.packageID = result._id.toString();
            await result.save();
            const _result = result.toJSON();
            const obj = {
                packageName: _result.packageName,
                _id: _result.packageID,
                review: _result.review,
                status: _result.status
            };
            res.status(200).json(obj);
        }

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: error });
    }
};


// export const addReview: any = (req: Request, res: Response) => {
//     if (req.body.reviewName) {
//         reviewmongo.findOne({ reviewName: req.body.reviewName },
//             async (err, result: any) => {
//                 if (err) {
//                     res.status(500).json(err);
//                 }
//                 else if (result) {
//                     console.log('in else result');
//                     res.status(400).json({
//                         msg: "Review Name Already exist"
//                     });
//                 }
//                 else {
//                     const user = new reviewmongo({
//                         reviewName: req.body.reviewName,
//                     });
//                     user.save(async (err, data: any) => {
//                         if (err) {
//                             res.json({
//                                 err: err
//                             });
//                         }
//                         else if (data) {
//                           const obj = {
//                                 reviewName: data.reviewName,
//                                 _id: data._id
//                             };
//                             res.status(200).json({
//                                 obj
//                             });
//                         }
//                     });
//                 }
//             });
//     }
//     else {
//         res.status(406).json({
//             statusCode: 406,
//             msg: "fill all details correctly",
//         });
//     }
// };

export const addReview = async (req: Request, res: Response) => {
    const user = new reviewmongo({
        reviewName: req.body.reviewName
    });
    const result: any = await user.save();
    if (result) {
        result.reviewID = result._id.toString();
        await result.save();
        const _result = result.toJSON();
        const obj = {
            reviewName: _result.reviewName,
            _id: _result.reviewID
        };
        res.status(200).json(obj);
    }
};

export const getReview = async (req: Request, res: Response) => {
    try {
        let page = 1, limit = 10, skip = 0;
        if (req.body.page) {
            page = req.body.page;
        }
        if (req.body.limit) {
            limit = req.body.limit;
        }
        if (page > 1) {
            skip = (page - 1) * limit;
        }
        const condition: any = {};
        if (req.body.reviewID) {
            condition.reviewID = {
                $regex: `${req.body.reviewID}`, $options: 'i'
            };
        }
        if (req.body.reviewName) {
            condition.reviewName = {
                $regex: `${req.body.reviewName}`, $options: 'i'
            };
        }
        const testReview: any = await reviewmongo.find(condition, { _id: 0 }).limit(limit).skip(skip);
        const count: any = await reviewmongo.count(condition);
        res.status(201).json({
            totalpage: Math.ceil(count / limit),
            data: testReview
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// export const addReviewName = async (req: Request, res: Response) => {
//     packagemongo.findOne({ packageName: req.body.packageName }, async function (err, data: any) {

//         if (err)
//             throw err;
//         else {
//             if (data) {
//                 packagemongo.update(
//                     {
//                         packageName: req.body.packageName
//                     },
//                     {
//                         $push: { review: req.body.review }
//                     },
//                     { upsert: true },
//                     function (err, result) {
//                         if (err) {
//                             console.log('err:  ' + err);
//                         }
//                         else {
//                             res.status(200).send(result);
//                         }
//                     }
//                 );
//             } else {
//                 res.status(400).send("data not found");
//             }
//         }
//     });
// };





import express, { json } from 'express';
import packagemongo from './packageModel';
import reviewmongo from './reviewModel';
import permission from './packagePermissionModel';
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
import productModels from '../product/productModels';

export const createPackage = async (req: Request, res: Response) => {
    try {
        if (req.body.packageName) {
            const ip: any = req.headers['x-forwarded-for'];
            let userIp: any;
            if (ip) {
                userIp = ip.split(',')[0];
            } else {
                userIp = "no ip";
            }

            const reviewAdd = req.body.reviewName;
            let review: any = [];
            const adminData: any = await admin.findOne({ _id: req.body.decoded }, { userName: 1, picture: 1 });
            console.log('dehbfh', adminData);
            await _.forEach(req.body.review, async (reviews) => {
                review.push(req.body.reviews);
            });
            const user = new packagemongo({
                packageName: req.body.packageName,
                status: req.body.status,
                review: req.body.review,
                createdBy: {
                    name: adminData.userName,
                    img: adminData.picture,
                    ip: userIp
                }
            });
            user.save(async (err, data: any) => {
                if (err) {
                    console.log("err=", err);
                    res.json({

                        err: err
                    });
                }
                else if (data) {
                    const obj = {
                        packageName: data.packageName,
                        _id: data.packageID,
                        review: data.review,
                        createdBy: data.createdBy,
                        status: data.status
                    };
                    res.status(200).json(obj);
                }
            });
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: error });
    }
};

export const addReview = async (req: Request, res: Response) => {
    const data: any = await reviewmongo.find({ name: req.body.name });
    if (data.length > 0) {
        res.status(400).json({ msg: 'Review name already exists' });
    } else {
        const user = new reviewmongo({
            name: req.body.name
        });
        const result: any = await user.save();
        if (result) {
            await result.save();
            const _result = result.toJSON();
            const obj = {
                name: _result.name
            };
            res.status(200).json("Successfully added");
        }
    }
};


export const getReview = async (req: Request, res: Response) => {
    try {
        let page = 1, limit = 5, skip = 0;
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
        const testReview: any = await reviewmongo.find(condition).limit(limit).skip(skip);
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




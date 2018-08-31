import express, { json } from 'express';
import packageModel from './packageModel';
import supplierModel from '../supplier/supplierModels';
import permission from './packagePermissionModel';
import brandModel from '../brands/brandModel';
import reviewManagementModel from './reviewManagmentModel';
import admin from '../admin/admin.model';
import jwt from 'jsonwebtoken';
import decoded from "jwt-decode";
import async from "async";
import { Response, Request, NextFunction } from 'express';
import { error } from 'util';
import moment from 'moment-timezone';
import _ from "lodash";
import productModels from '../product/productModels';
import userModels from '../user/userModels';
import userFeedbackModel from './userFeedbackModel';
import chalk from "chalk";

export const createReview = async (req: Request, res: Response) => {
    try {
        const ip: any = req.headers['x-forwarded-for'];
        let userIp: any;
        if (ip) {
            userIp = ip.split(',')[0];
        } else {
            userIp = "no ip";
        }
        // const pacData: any = await packageModel.findOne({ _id: "5b1b7e3bce8808463d3b37f2" }, { review: 1 });
        const productData: any = await productModels.findOne({ _id: req.body.productId }, { image: 1, productNameEn: 1, });
        const adminData: any = await admin.findOne({ email: "admin@gmail.com" }, { userName: 1, picture: 1 });
        const userData: any = await userModels.findOne({ _id: req.body.decoded._id });
        console.log("hello", userData);
        const allData: any = new reviewManagementModel({
            productID: req.body.productId,
            productNameEn: productData.productNameEn,
            image: productData.image,
            review: req.body.review,
            deliverPerson: {
                name: "Sunil",
                image: userData.picture,
                ip: userIp
            },
            reviewedBy: {
                name: userData.userName,
                image: userData.picture,
                ip: userIp
            },
            createdBy: {
                userName: adminData.userName,
                image: adminData.picture,
                ip: "103.206.131.110"
            },
            message: req.body.message,
            points: req.body.points
        });
        await allData.save();
        res.status(200).json(allData);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const filterReviewManagement = async (req: Request, res: Response) => {
    try {
        let userId = req.body.decoded._id;
        let reviews: any = [];
        console.log(chalk.cyan("hello"));
        const reviewManagementData: any = await reviewManagementModel.find({ productID: req.body.productId });
        async.forEach(reviewManagementData, async (review: any, cb: any) => {
            let feedback: any = await userFeedbackModel.findOne({ reviewId: review._id, userId: userId });
            let item: any = review;
            let userFeedback: any = {};
            if (feedback) {
                if (feedback.isLike) {
                    userFeedback.userLike = feedback.isLike;
                }
                else if (feedback.isDislike) {
                    userFeedback.userDislike = feedback.isDislike;
                }
            }
            console.log("item---------->", item, '---', feedback);
            reviews.push({ ...item.toObject(), ...userFeedback });
            cb();
        }, (err: any) => {
            res.status(200).json({ 'reviews': reviews });
        });
        // const userFeedback: any = await userFeedbackModel.find();
        // console.log("review",reviewManagementData);
        // async.forEach(userFeedback,async (feedback:any,cb)=>{
        //     if (req.body.decoded._id==feedback.userId && ){}
        // })
        // if (Object.keys(reviewManagementData).length > 0) {
        //     res.status(200).json({ success: "true", reviewManagementData});
        // } else {
        //     res.status(200).json({ success: false, reviewManagementData });
        // }
    }
    catch (error) {
        res.status(500).send(error);
    }

    // try {
    //     const reviewManagementData: any = await reviewManagementModel.find();
    //     const userFeedback: any = await userFeedbackModel.find();
    //     console.log("review",reviewManagementData);
    //     async.forEach(userFeedback,async (feedback:any,cb)=>{
    //         if (req.body.decoded._id==feedback.userId && ){}
    //     })
    //     if (Object.keys(reviewManagementData).length > 0) {
    //         res.status(200).json({ success: "true", reviewManagementData});
    //     } else {
    //         res.status(200).json({ success: false, reviewManagementData });
    //     }
    // }
    // catch (error) {
    //     res.status(500).send(error);
    // }
};


// export const filterReviewManagement = async (req: Request, res: Response) => {
//     console.log('body in filter packg--->', req.body);
//     let skip_Value;
//     let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
//     if (req.query.page != undefined && req.query.page > 1) {
//         skip_Value = limitValue * (req.query.page - 1);
//     } else { skip_Value = 0; }
//     if (req.query.limit != undefined) {
//         limitValue = parseInt(req.query.limit);
//     }
//     let condition: any = {};
//     if (req.body.productNameEn) {
//         condition.productNameEn = new RegExp('^' + req.body.productNameEn, "i");
//     }
//     if (req.body.name) {
//         condition = {
//             "createdBy.name": new RegExp('^' + req.body.name, "i"),
//         };
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
//     try {
//         console.log("filterpckgreview condition Is==>", condition);
//         const reviewManagementData: any = await reviewManagementModel.find(condition).sort({ createdAt: -1 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
//         const totalCount = await reviewManagementModel.count(condition);
//         console.log("total count of reviewpackg is==>", totalCount);
//         const totalPage = Math.ceil(totalCount / limitValue);
//         console.log("total Page in reviewpackg filtered===>", totalPage);
//         if (Object.keys(reviewManagementData).length > 0) {
//             res.status(200).json({ success: "true", reviewManagementData, totalPage });
//         } else {
//             res.status(200).json({ success: false, reviewManagementData });
//         }
//     }
//     catch (error) {
//         res.status(500).send(error);
//     }
// };


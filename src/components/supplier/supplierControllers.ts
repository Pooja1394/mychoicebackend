import express, { json } from 'express';
import suppliermongo from './supplierModels';
import admin from "../admin/admin.model";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import async from "async";
export const jwt_secret = "jangan";
import { Response, Request, NextFunction } from 'express';
import { error } from 'util';
import constant from '../config/constant';
import multer from 'multer';
import path from 'path';
import mongoose from 'mongoose';
import fs from 'fs';
import _ from "lodash";


// export const addSupplier = async (req: Request, res: Response) => {
//     let count = 1;
//     await _.forEach(req.files, async (element: any) => {
//         if (count === 1) {
//             req.body.image = element.filename;
//             count++;
//         }
//         else {
//             req.body.infoFile = element.filename;
//         }
//     });
//     console.log("Body====>", req.body);
//     suppliermongo.find({ supplierNameEn: req.body.supplierNameEn }, (err, data) => {
//         if (err) {
//             throw err;
//         } else {
//             if (data.length) {
//                 res.status(400).json({ msg: 'Supplier name already exists' });
//             }
//         }
//         if (req.body.supplierNameEn && req.body.supplierNameMn && req.body.authPerson && req.body.designation) {

//             const user = new suppliermongo(req.body);
//             user.save((err, result) => {
//                 if (err) {
//                     res.json({
//                         err: err
//                     });
//                 }
//                 else {
//                     const _result = result.toJSON();
//                     const obj = {
//                         supplierNameEn: _result.supplierNameEn,
//                         supplierNameMn: _result.supplierNameMn,
//                         authPerson: _result.authPerson,
//                         designation: _result.designation,
//                         address: _result.address,
//                         town: _result.town,
//                         status: _result.status,
//                         createdBy: _result.createdBy,
//                         state: _result.state,
//                         phoneNum1: _result.phoneNum1,
//                         phoneNum2: _result.phoneNum2,
//                         image: _result.image,
//                         infoFile: _result.infoFile,
//                         brand: _result.brand
//                     };
//                     res.json(obj);
//                 }
//             });
//         } else {
//             res.status(400).json({ msg: 'Please fill all require fields' });
//         }
//     });
// };

export const addSupplier = async (req: Request, res: Response) => {
    try {
        if (req.body.supplierNameEn && req.body.supplierNameMn && req.body.authPerson && req.body.designation) {
            let count = 1;
            const image: any = [];
            await _.forEach(req.files, async (element: any) => {
                if (count === 1) {
                    req.body.image = element.filename;
                    count++;
                }
                else {
                    image.push(element.filename);
                }
                req.body.infoFile = image;
            });
            const data: any = await suppliermongo.find({ supplierNameEn: req.body.supplierNameEn, supplierNameMn: req.body.supplierNameMn });
            if (data.length > 0) {
                res.status(400).json({ msg: 'Supplier name already exists' });
            } else {
                const ip: any = req.headers['x-forwarded-for'];
                console.log("ip = ", ip);
                const userIp = ip.split(",")[0];
                const adminData: any = await admin.findById(mongoose.Types.ObjectId(req.body.decoded._id));
                const user = new suppliermongo({
                    supplierNameEn: req.body.supplierNameEn,
                    supplierNameMn: req.body.supplierNameMn,
                    authPerson: req.body.authPerson,
                    designation: req.body.designation,
                    image: req.body.image,
                    infoFile: req.body.infoFile,
                    address: req.body.address,
                    town: req.body.town,
                    state: req.body.state,
                    phoneNum1: req.body.phoneNum1,
                    phoneNum2: req.body.phoneNum2,
                    status: req.body.status,
                    createdBy: {
                        name: adminData.userName,
                        img: adminData.picture,
                        ip: userIp
                    }
                });
                const result: any = await user.save();
                if (result) {
                    result.supplierID = "SUP" + result._id.toString();
                    await result.save();
                    const _result = result.toJSON();
                    const obj = {
                        supplierNameEn: _result.supplierNameEn,
                        supplierNameMn: _result.supplierNameMn,
                        authPerson: _result.authPerson,
                        designation: _result.designation,
                        address: _result.address,
                        town: _result.town,
                        status: _result.status,
                        createdBy: _result.createdBy,
                        state: _result.state,
                        phoneNum1: _result.phoneNum1,
                        phoneNum2: _result.phoneNum2,
                        image: _result.image,
                        infoFile: _result.infoFile,
                        brand: _result.brand
                    };
                    res.status(200).json(obj);
                }
            }
        } else {
            res.status(400).json({ msg: 'Please fill all require fields' });
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: error });
    }
};


// export const updateSupplier = async (req: Request, res: Response) => {
//     let count = 1;
//     await _.forEach(req.files, async (element: any) => {
//         if (count === 1) {
//             req.body.image = element.filename;
//             count++;
//         }
//         else {
//             req.body.infoFile = element.filename;
//         }
//     });
//     suppliermongo.findOneAndUpdate({ _id: req.body._id },
//         {
//             $set: {
//                 supplierNameEn: req.body.supplierNameEn,
//                 supplierNameMn: req.body.supplierNameMn,
//                 authPerson: req.body.authPerson,
//                 designation: req.body.designation,
//                 town: req.body.town,
//                 address: req.body.address,
//                 state: req.body.state,
//                 phoneNum1: req.body.phoneNum1,
//                 phoneNum2: req.body.phoneNum2,
//                 image: req.body.image,
//                 infoFile: req.body.infoFile,
//             },
//         }, { new: true }, (err, data: any) => {
//             console.log(err, data);
//             if (err) {
//                 res.status(500).json({ msg: err });
//             } else {

//                 res.status(200).send(data);
//             }
//         }
//     );
// };
export const updateSupplier = async (req: Request, res: Response) => {
    try {
        const condition: any = {};
        console.log("gfufjfugm>>>>>>>> ", req.body.imageType, req.body.imageType == "image", req.body.imageType == "infoFile", req.body.imageType == "both");

        if (req.body.imageType == "image") {
            const condition: any = {};
            _.forEach(req.files, async (element: any) => {
                console.log("enter", element);
                //             image.push(element.filename);
                suppliermongo.update({ _id: req.body._id }, {
                    $set: {
                        image: element.filename
                    }
                }, (err, update) => {
                    console.log("update", update);
                });
            });
            res.json({ msg: "ok" });
        }
        if (req.body.imageType == "infoFile") {
            const condition: any = {};
            _.forEach(req.files, async (element: any) => {
                console.log("enter", element);
                //             image.push(element.filename);
                suppliermongo.update({ _id: req.body._id }, {
                    $push: {
                        infoFile: element.filename
                    }
                }, (err, update) => {
                    console.log("update", update);
                });
            });
            res.json({ msg: "ok" });
        }
        if (req.body.imageType == "both") {
            const condition: any = {};
            _.forEach(req.files, async (element: any) => {
                console.log("enter", element);
                //             image.push(element.filename);
                suppliermongo.update({ _id: req.body._id }, {
                    $push: {
                        image: element.filename,
                        infoFile: element.filename
                    }
                }, (err, update) => {
                    console.log("update", update);
                });
            });
            res.json({ msg: "ok" });
        }        if (req.body.supplierNameEn) {
            condition.supplierNameEn = req.body.supplierNameEn;
        }
        if (req.body.supplierNameMn) {
            condition.supplierNameMn = req.body.supplierNameMn;
        }
        if (req.body.authPerson) {
            condition.authPerson = req.body.authPerson;
        }
        if (req.body.designation) {
            condition.designation = req.body.designation;
        }
        if (req.body.town) {
            condition.town = req.body.town;
        }
        if (req.body.address) {
            condition.address = req.body.address;
        }
        if (req.body.state) {
            condition.state = req.body.state;
        }
        if (req.body.phoneNum1) {
            condition.phoneNum1 = req.body.phoneNum1;
        }
        if (req.body.phoneNum2) {
            condition.phoneNum2 = req.body.phoneNum2;
        }
        if (req.body.status) {
            condition.status = req.body.status;
        }
        console.log("condition", condition);
        const updateData: any = await suppliermongo.findOneAndUpdate({ _id: req.body._id }, { $set: condition }, { new: true });
        if (updateData) {
            res.status(200).json(updateData);
        }
    } catch (error) {
        console.log("error", error);
        res.status(400).json({ error: error });
    }
   };

export const getSupplier = async (req: Request, res: Response) => {
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
        // console.log(page, limit, skip);
        const condition: any = {};
        if (req.body.supplierID) {
            condition.supplierID = {
                $regex: `${req.body.supplierID}`, $options: 'i'
            };
        }
        if (req.body.created) {
            const str = (req.body.created).split("-");
            const searchDate = new Date(str[1].trim() + "-" + str[2].trim() + "-" + str[0].trim());            // const date = new Date(searchDate);
            const startDate = new Date(searchDate);
            startDate.setDate(startDate.getDate() - 1);
            const endDate = searchDate;
            endDate.setDate(endDate.getDate() + 1);
            condition.createdAt = { $gt: new Date(startDate), $lt: new Date(endDate) };
        }
        if (req.body.supplierName) {
            condition.supplierNameEn = {
                $regex: `${req.body.supplierName}`, $options: 'i'
            };
        }
        if (req.body.brand) {
            condition.brand = req.body.brand;
        }
        if (req.body.createdBy) {
            condition["createdBy.name"] = {
                $regex: `${req.body.createdBy}`, $options: 'i'
            };
        }
        if (req.body.status) {
            condition.status = req.body.status;
        }
        console.log("condition ", condition);
        const supplierData: any = await suppliermongo.find(condition).limit(limit).skip(skip);
        const count: any = await suppliermongo.count(condition);
        res.status(201).json({
            totalPages: Math.ceil(count / limit),
            data: supplierData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const filterBySupplierName = async (req: Request, res: Response) => {
    try {
        await suppliermongo.find({ supplierNameEn: new RegExp('^' + req.query.supplierNameEn, "i") }, (err, data: any) => {
            if (err) {
                throw err;
            }
            else {
                res.status(200).json(data);
            }

        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const autoFillApi = async (req: Request, res: Response) => {
    suppliermongo.find({ _id: req.query.id }, (err, task) => {
        if (err)
            res.json(err);
        res.json(task);
    });
};

export const deleteSupplier = async (req: Request, res: Response) => {
    try {
        const data: any = await suppliermongo.findByIdAndRemove({ _id: req.body._id });
        if (data) {
            await data.save();
            res.status(200).json({
                msg: "Successfully Deleted"
            });
        }
        else {
            res.status(400).json({
                msg: "data not found"
            });
        }
    }
    catch (error) {
        console.log("error", error);
        res.status(400).json({ error: error });
    }
};


// export const imgUpload = async (req: Request, res: Response) => {
//     if (!req.params._id) {
//         res.status(400).send('Enter id in params');
//     } else {
//         try {

//             const array = [];
//             await array.push(req.files);
//             await _.forEach(array[0], async (element: any) => {

//                 // console.log("File name===>", element.filename)

//                 await suppliermongo.findOneAndUpdate({
//                     '_id': req.params._id
//                 }, {
//                         $push: {
//                             "image": element.filename
//                         }
//                     }, { new: true });

//             });

//             res.status(200).json({
//                 msg: "Image successfully uploaded",

//             });

//         } catch (error) {
//             const newLocal = res.status(400).send(error);
//         }
//     }

// };

export const removeImage = async (req: Request, res: Response) => {
    try {
        const data: any = await suppliermongo.findById({ _id: req.body._id });
        if (data) {
            data.image = "";
            await data.save();
            res.status(200).json({
                msg: "Successfully Removed"
            });
        }
        else {
            res.status(400).json({
                msg: "data not found"
            });
        }
    }
    catch (error) {
        console.log("error", error);
        res.status(400).json({ error: error });
    }
};



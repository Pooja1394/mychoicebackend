import express, { json } from 'express';
import brandmongos from './brandModel';
import supplierDb from '../supplier/supplierModels';
import bcrypt from 'bcryptjs';
import searchSupplierModel from '../supplier/supplierModels';
import admin from "../admin/admin.model";
import productModel from "../product/productModels";
import jwt from 'jsonwebtoken';
import async from "async";
const jwt_secret = "jangan";
import { Response, Request, NextFunction } from "express";
import { error } from 'util';
import multer from 'multer';
import path from 'path';
import mongoose from 'mongoose';
import fs from 'fs';
import _ from "lodash";
import constant from '../config/constant';
import bankModels from '../bank/bankModels';

export const createBrands = async (req: Request, res: Response) => {
    try {
        if (req.body.brandNameEn && req.body.descriptionEn && req.body.descriptionMn && req.body.designation) {
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
            const data: any = await brandmongos.find({ brandNameEn: req.body.brandNameEn, brandNameMn: req.body.brandNameMn });
            if (data.length > 0) {
                res.status(400).json({ msg: 'Brand name already exists' });
            } else {
                console.log("req.body.supplierName", req.body.supplierName);
                const supplierName: any = JSON.parse(req.body.supplierName);
                console.log("supplierName", supplierName);
                const supplierName1: any = req.body.supplierName;
                const ip: any = req.headers['x-forwarded-for'];
                const userIp = ip.split(",")[0];
                const adminData: any = await admin.findById(mongoose.Types.ObjectId(req.body.decoded._id));
                const user = new brandmongos({
                    brandNameEn: req.body.brandNameEn,
                    brandNameMn: req.body.brandNameMn,
                    descriptionEn: req.body.descriptionEn,
                    descriptionMn: req.body.descriptionMn,
                    supplierName: supplierName,
                    authPerson: req.body.authPerson,
                    designation: req.body.designation,
                    address: req.body.address,
                    supplier: supplierName.length,
                    supplierList: req.body.supplierList,
                    createdBy: {
                        name: adminData.userName,
                        img: adminData.picture,
                        ip: userIp
                    },
                    status: req.body.status,
                    image: req.body.image,
                    infoFile: req.body.infoFile,
                    town: req.body.town,
                    state: req.body.state
                });
                const result: any = await user.save();

                _.forEach(supplierName, async function (value) {
                    console.log(value);
                    const updateSupp: any = await supplierDb.update({ "_id": mongoose.Types.ObjectId(value.id) }, { $inc: { brand: 1 } }, { new: true });
                    console.log(updateSupp);
                });

                if (result) {
                    result.brandID = "BRN" + result._id.toString();
                    await result.save();
                    const _result = result.toJSON();
                    const obj = {
                        brandNameEn: _result.brandNameEn,
                        brandNameMn: _result.brandNameMn,
                        descriptionEn: _result.descriptionEn,
                        descriptionMn: _result.descriptionMn,
                        supplierName: _result.supplierName,
                        authPerson: _result.authPerson,
                        designation: _result.designation,
                        address: _result.address,
                        town: _result.town,
                        status: _result.status,
                        createdBy: _result.createdBy,
                        state: _result.state,
                        image: _result.image,
                        infoFile: _result.infoFile,
                        product: _result.product,
                        supplier: _result.supplier
                    };
                    res.status(200).json([obj]);
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

export const getBrands = async (req: Request, res: Response) => {
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
        if (req.body.brandName) {
            condition.brandNameEn = {
                $regex: `${req.body.brandName}`, $options: 'i'
            };
        }
        if (req.body.brandID) {
            condition.brandID = {
                $regex: `${req.body.brandID}`, $options: 'i'
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
        if (req.body.product) {
            condition.product = req.body.product;
        }
        if (req.body.supplier) {
            condition.supplier = req.body.supplier;
        }
        if (req.body.supplierName) {
            condition.supplierList = {
                $regex: `${req.body.supplierName}`, $options: 'i'
            };
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
        const brandData: any = await brandmongos.find(condition).limit(limit).skip(skip);
        const count: any = await brandmongos.count(condition);
        res.status(201).json({
            totalPages: Math.ceil(count / limit),
            data: brandData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const filterByBrandName = async (req: Request, res: Response) => {
    await brandmongos
        .find({ brandNameEn: new RegExp('^' + req.query.brandNameEn, "i") }, (err, data: any) => {
            if (err) {
                throw err;
            }
            else {
                res.status(200).json(data);
            }
        });
};

export const deleteBrands = async (req: Request, res: Response) => {
    try {
        const data: any = await brandmongos.findByIdAndRemove({ _id: req.body._id });
        if (data) {
            await data.save();
            res.status(200).json({
                msg: 'Data successfully deleted'
            });
        } else {
            res.status(400).json({
                msg: 'Data not found'
            });
        }
    } catch (error) {
        console.log("error", error);
        res.status(400).json({ error: error });
    }
};
export const updateBrands = async (req: Request, res: Response) => {

    try {
        const condition: any = {};
        console.log(req.body.imageType, req.body.imageType == "image", req.body.imageType == "infoFile", req.body.imageType == "both");
        console.log("gfufjfugm>>>>>>>> ", req.body.imageType, req.body.imageType == "image", req.body.imageType == "infoFile", req.body.imageType == "both");
    if (req.body.imageType == "image") {
        const condition: any = {};
        _.forEach(req.files, async (element: any) => {
            console.log("enter", element);
            //             image.push(element.filename);
           brandmongos.update({ _id: req.body._id }, {
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
           brandmongos.update({ _id: req.body._id }, {
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
           brandmongos.update({ _id: req.body._id }, {
                $push: {
                    image: element.filename,
                    infoFile: element.filename
                }
            }, (err, update) => {
                console.log("update", update);
            });
        });
        res.json({ msg: "ok" });
    }

        if (req.body.supplierName) {
            const brandData: any = await brandmongos.findOne({ _id: req.body._id });
            await _.forEach(brandData.supplierName, async function (value) {
                console.log(value);
                const updateSupp: any = await supplierDb.update({ "_id": mongoose.Types.ObjectId(value.id) }, { $inc: { brand: -1 } }, { new: true });
                console.log(updateSupp);
            });

            console.log("req.body.supplierName", req.body.supplierName);
            const supplierName: any = JSON.parse(req.body.supplierName);
            console.log("supplierName", supplierName);
            // const supplierName: any = req.body.supplierName;

            await _.forEach(supplierName, async function (value) {
                console.log(value);
                const updateSupp: any = await supplierDb.update({ "_id": mongoose.Types.ObjectId(value.id) }, { $inc: { brand: 1 } }, { new: true });
                console.log(updateSupp);
            });

            condition.supplierName = supplierName;
            condition.supplier = supplierName.length;
            condition.supplierList = req.body.supplierList;
        }
        if (req.body.brandNameEn) {
            condition.brandNameEn = req.body.brandNameEn;
        }
        if (req.body.brandNameMn) {
            condition.brandNameMn = req.body.brandNameMn;
        }
        if (req.body.descriptionEn) {
            condition.descriptionEn = req.body.descriptionEn;
        }
        if (req.body.descriptionMn) {
            condition.descriptionMn = req.body.descriptionMn;
        }
        if (req.body.authPerson) {
            condition.authPerson = req.body.authPerson;
        }
        if (req.body.designation) {
            condition.designation = req.body.designation;
        }
        if (req.body.address) {
            condition.address = req.body.address;
        }
        if (req.body.town) {
            condition.town = req.body.town;
        }
        if (req.body.status) {
            condition.status = req.body.status;
        }
        if (req.body.state) {
            condition.state = req.body.state;
        }
        console.log("condition", condition);
        const updateData: any = await brandmongos.findOneAndUpdate({ _id: req.body._id }, { $set: condition }, { new: true });
        if (updateData) {
            res.status(200).json(updateData);
        }
    } catch (error) {
        console.log("error", error);
        res.status(400).json({ error: error });
    }

    // let count = 1;
    // await _.forEach(req.files, async (element: any) => {
    //     if (count === 1) {
    //         req.body.image = element.filename;
    //         count++;
    //     }
    //     else {
    //         req.body.infoFile = element.filename;
    //     }
    // });
    // await brandmongos.findOneAndUpdate({ _id: req.body._id },
    //     {
    //         $set: {
    //             brandNameEn: req.body.brandNameEn,
    //             brandNameMn: req.body.brandNameMn,
    //             descriptionEn: req.body.descriptionEn,
    //             descriptionMn: req.body.descriptionMn,
    //             supplierName: req.body.supplierName,
    //             authPerson: req.body.authPerson,
    //             designation: req.body.designation,
    //             address: req.body.address,
    //             town: req.body.town,
    //             status: req.body.status,
    //             // createdBy: req.body.createdBy,
    //             state: req.body.state,
    //             image: req.body.image,
    //             infoFile: req.body.infoFile,
    //             // product: req.body.product,
    //             // supplier: req.body.supplier
    //         },
    //     }, { new: true }, (err, data) => {
    //         if (err) {
    //             res.status(500).json({ msg: err });
    //         } else {
    //             res.status(200).json(data);
    //         }
    //     }
    // );
};

export const autoFillBrand = async (req: Request, res: Response) => {
    brandmongos
        .find({ _id: req.query.id }, (err, task) => {
            if (err)
                res.json(err);
            res.json(task);
        });
};

export const imgUpload = async (req: Request, res: Response) => {
    // console.log('ssss----', req.files)
    if (!req.params._id) {
        res.status(400).json({ msg: 'Enter Id in params' });
    } else {
        try {

            const array = [];
            await array.push(req.files);
            await _.forEach(array[0], async (element: any) => {

                // console.log("File name===>", element.filename)

                await brandmongos
                    .findOneAndUpdate({
                        '_id': req.params._id
                    }, {
                            $push: {
                                "image": element.filename
                            }
                        }, { new: true });

            });

            res.status(200).json({
                msg: "Image successfully uploaded",

            });

        } catch (error) {
            const newLocal = res.status(400).json(error);
        }
    }

};

// export const removeImage = async (req: Request, res: Response) => {
//     const data: any = await brandmongos
//         .findById({ _id: req.body._id  });
//     if (data) {
//         data.image = "" && data.infoFile == "";
//         await data.save();
//         res.status(200).json({ msg: 'Image deleted successfully' });
//     } else {
//         res.status(400).json({ msg: 'data not found' });
//     }

// };

export const removeImage = async (req: Request, res: Response) => {
    try {
        const data: any = await brandmongos.findById({ _id: req.body._id });
        if (data) {
            data.image = "";
            await data.save();
            res.status(200).json({
                msg: 'Image successfully deleted'
            });
        } else {
            res.status(400).json({
                msg: 'Data not found'
            });
        }
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ error: error });
    }
};

export const supplierSearch = async (req: Request, res: Response) => {
    try {
        const condition: any = {};
        if (req.query.search) {
            condition.supplierNameEn = {
                $regex: `${req.query.search}`,
                $options: 'i'
            };
        }
        console.log(condition);
        const data: any = await searchSupplierModel.find(condition, { supplierNameEn: 1 });
        res.status(200).json({
            data: data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const getSupplierBrand = async (req: Request, res: Response) => {
    try {
        const supplierData = await supplierDb.find({}, { supplierNameEn: 1, _id: 1 });
        res.status(200).json(supplierData);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
export const getBrandSuplier = async (req: Request, res: Response) => {
    console.log("body getsupplbra===>", req.body);
    try {
        const brands = await brandmongos.find({ "supplierName.id": req.body.supplierID }, { brandNameEn: 1, brandID: 1, _id: 1 });
        console.log("bands", brands);
        res.status(200).json(brands);

    }
    catch (error) {
        res.status(500).json(error);
    }
};

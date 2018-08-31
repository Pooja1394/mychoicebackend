import express, { json } from 'express';
import usermongos from './catagoryModels';
import bcrypt from 'bcryptjs';
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


export const createCate = async (req: Request, res: Response) => {
    let count = 1;
    await _.forEach(req.files, async (element: any) => {
        if (count === 1) {
            req.body.image = element.filename;
            count++;
        }
        else {
            req.body.infoFile = element.filename;
        }
    });
    console.log("Brands===>", req.body);
    if (req.body.cataNameEn && req.body.cateNameMn && req.body.descriptionEn && req.body.descriptionMn
        && req.body.brandName) {
        const user = new usermongos(req.body);
        user.save((err, result) => {
            if (err) {
                res.json({
                    err: err
                });
            }
            else {
                const _result = result.toJSON();
                const obj = {
                    cataNameEn: _result.cataNameEn,
                    cateNameMn: _result.cateNameMn,
                    descriptionEn: _result.descriptionEn,
                    descriptionMn: _result.descriptionMn,
                    brandName: _result.brandName,
                    createdBy: _result.createdBy,
                    image: _result.image,
                    infoFile: _result.infoFile,
                    brand: _result.brand
                };
                res.json(obj);
            }
        });
    } else {
        res.status(400).json({ msg: 'Please fill all require fields' });
    }
};

export const getCate = async (req: Request, res: Response) => {
    usermongos.find({}, (err, task) => {
        if (err)
            res.json(err);
        res.json(task);
    });
};

export const deleteCate = async (req: Request, res: Response) => {
    await usermongos.findByIdAndRemove({ _id: req.body._id }, (err) => {
        if (err) {
            throw err;
        } else {
            res.status(200).json({ msg: "Data Successfully deleted" });
        }
    });
};

export const updateCate = async (req: Request, res: Response) => {
    usermongos.findOneAndUpdate({ _id: req.body._id }, req.body, (err, data) => {
        if (err)
            throw err;
        else
            res.status(200).json({ msg: "Data successfully change" });
    });
};

export const removeImage = async (req: Request, res: Response) => {
    const data: any = await usermongos.findById({ _id: req.body._id });
    if (data) {
        data.image = "";
        await data.save();
        res.status(200).json({ mes: 'Image deleted successfully' });
    } else {
        res.status(400).json({ mes: 'data not found' });
    }

};
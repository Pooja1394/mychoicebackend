import express, { json } from 'express';
import packagemongo from './packageModel';
import reviewmongo from './reviewModel';
import moment from 'moment-timezone';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import async from "async";
export const jwt_secret = "jangan";
import { Response, Request, NextFunction } from 'express';
import { error } from 'util';
import multer from 'multer';
import path from 'path';
import mongoose from 'mongoose';
import fs from 'fs';
import _ from "lodash";

export const filterPackage = async (req: Request, res: Response) => {
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
        if (req.body.review) {
            condition.review;
        }
        if (req.body.packageID) {
            condition.packageID = {
                $regex: `${req.body.packageID}`, $options: 'i'
            };
        }
        if (req.body.packageName) {
            condition.packageName = {
                $regex: `${req.body.packageName}`, $options: 'i'
            };
        }
        if (req.body.createdBy) {
            condition["createdBy.name"] = {
                $regex: `${req.body.createdBy}`, $options: 'i'
            };
        }
        if (req.body.suspend == "All") {
            condition;
        }
        if (req.body.status == "Open") {
            condition.status = req.body.status;
        }
        if (req.body.status == "Lock") {
            condition.status = req.body.status;
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
        const testReview: any = await packagemongo.find(condition).limit(limit).skip(skip);
        const count: any = await packagemongo.count(condition);
        res.status(201).json({
            totalpage: Math.ceil(count / limit),
            data: testReview
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
import express from "express";
import notemongo from "./typeModel";
import bcrypt from "bcryptjs";
import axios from "axios";
import decoded from "jwt-decode";
import multer from "multer";
import moment from "moment-timezone";
import path from "path";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import async from "async";
export const jwt_secret = "ADIOS AMIGOS";

import { Response, Request, NextFunction } from "express";
import { json } from "body-parser";
// import * as  xlsxtojson  from "xls-to-json";
import fs from "fs";
const app = express();
const xlsxtojson = require("xls-to-json");

export const insertTypeData = async (req: Request, res: Response) => {
    const obj = req.body;
    const types = new notemongo(obj);
    types.save((err: any, data: any) => {
        if (err) {
            res.status(400).json({
                msg: "Error while Inserting Data"
            });
        }
        else {
            res.status(200).json({ msg: "Successfully Inserted Data" });
        }
    });
};
export const getTypeData = async (req: Request, res: Response) => {
    try {
        await notemongo.find({}, { _id: 0, __v: 0 },
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
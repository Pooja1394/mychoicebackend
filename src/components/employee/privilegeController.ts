import express from 'express';
import { Request, Response, NextFunction } from 'express';
import privilegeModel from './privilegeModel';
import moment from 'moment-timezone';
import decoded from 'jwt-decode';
import mongoose from 'mongoose';
import shortid from "shortid";
import Admin from "../admin/admin.model";

/**
 * employee privileges create API.
 */
export let priviledges = async (req: Request, res: Response) => {
    console.log("you are in create privilege controller and body is-->", req.body);
    try {
        // const ip: any = req.headers['x-forwarded-for'];
        // const userIp = ip.split(",")[0];
        const id = shortid.generate();
        console.log("hii", req.body.decoded._id);
        const privilegeData = new privilegeModel({
            PrivilegeId: id,
            privilegeName: req.body.privilegeName,
            description: req.body.description,
            privilege: req.body.privilege,
            status: req.body.status,
            createdBy: req.body.decoded._id,
        });
        await privilegeData.save();
        console.log(Object.keys(privilegeData).length);
        if (Object.keys(privilegeData).length > 0) {
            res.status(201).json(privilegeData);
        }
        else {
            res.status(400).json({ msg: "Please fill all detail first!" });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
};
/**
 * employee privileges filter API.
 */
export let searchPrivilege = async (req: Request, res: Response) => {
    console.log("***body**privileges filter==>", req.body);
    let skip_Value;
    let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
    if (req.query.page != undefined && req.query.page > 1) {
        skip_Value = limitValue * (req.query.page - 1);
    } else { skip_Value = 0; }
    if (req.query.limit != undefined) {
        limitValue = parseInt(req.query.limit);
    }
    let condition: any = {};
    if (req.body.PrivilegeId) {
        condition.PrivilegeId = new RegExp('^' + req.body.PrivilegeId, 'i');
    }
    if (req.body.status) {
        condition.status = req.body.status; // new RegExp('^' + req.body.status, 'i');
    }
    if (req.body.privilegeName) {
        condition.privilegeName = new RegExp('^' + req.body.privilegeName, 'i');
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
    if (req.body.createdBy) {
        const hii: any = await Admin.find({ userName: new RegExp('^' + req.body.createdBy, 'i') }, { userName: 1 });
        if (hii.length) {
            condition.createdBy = hii[0]._id;
        } else {
            condition.createdBy = "5b29ee7b9e54c02441c16546";
        }

    }
    console.log("search Privileges API condition Is!--->", condition);
    try {
        const privilegeData: any = await privilegeModel.find(condition).populate('createdBy').sort({ createdAt: -1 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        const totalCount = await privilegeModel.count(condition);
        console.log("total count of search privilege is==>", totalCount);
        const totalPage = Math.ceil(totalCount / limitValue);
        console.log("total Page in search privilege filtered===>", totalPage);
        if (Object.keys(privilegeData).length > 0) {
            res.status(200).json({ privilegeData, totalPage });
        } else {
            res.status(200).json({ success: "No Data found", privilegeData });
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
};
/**
 * Delete employee privileges API.
 *
 */
export let removePrivilege = async (req: Request, res: Response) => {
    console.log("body under removePrivilege--->", req.body);
    try {
        const privilegeData: any = await privilegeModel.findByIdAndRemove(mongoose.Types.ObjectId(req.body.privilegeId));
        res.status(200).json('Remove Successfully!');
    }
    catch (error) {
        res.status(500).json(error);
    }
};
export const updatePrivilege = async (req: Request, res: Response) => {
    try {
        await privilegeModel.findOneAndUpdate({ _id: req.body._id },
            {
                $set: {
                    privilegeName: req.body.privilegeName,
                    description: req.body.description,
                    privilege: req.body.privilege,
                    status: req.body.status,
                }

            }, { new: true }, (err, data: any) => {
                if (data) {
                    const _result = data.toJSON();
                    const obj = {
                        privilegeName: _result.privilegeName,
                        description: _result.description,
                        privilege: _result.privilege,
                        status: _result.status,
                    };
                    res.status(200).json(obj);
                }
                else {
                    res.status(400).json({ msg: "Not updated" });
                }
            });

    }
    catch (err) {
        console.log("Error Found");
        res.status(500).json(err);
    }
};

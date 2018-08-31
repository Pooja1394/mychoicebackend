import express from 'express';
import { Request, Response, NextFunction } from 'express';
import DesignationModel from '../employee/DesignationModel';
import moment from 'moment-timezone';
import decoded from 'jwt-decode';
import shortid from "shortid";
import mongoose from 'mongoose';
import Admin from "../admin/admin.model";

export let addDesignation = async (req: Request, res: Response) => {
    console.log("you are in create privilege controller and body is-->", req.body);
    try {
        const id = shortid.generate();
        console.log("hii", req.body.decoded._id);
        const DesignationData = new DesignationModel({
            DesignationId: id,
            DesignationName: req.body.DesignationName,
            Description: req.body.Description,
            privilege: req.body.privilege,
            status: req.body.status,
            createdBy: req.body.decoded._id,
        });
        await DesignationData.save();
        console.log(Object.keys(DesignationData).length);
        if (Object.keys(DesignationData).length > 0) {
            res.status(201).json(DesignationData);
        }
        else {
            res.status(400).json({ msg: "Please fill all detail first!" });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
};

export let getDesignation = async (req: Request, res: Response) => {
    let skip_Value;
    let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
    if (req.query.page != undefined && req.query.page > 1) {
        skip_Value = limitValue * (req.query.page - 1);
    } else { skip_Value = 0; }
    if (req.query.limit != undefined) {
        limitValue = parseInt(req.query.limit);
    }
    let condition: any = {};
    if (req.body.DesignationId) {
        condition.DesignationId = new RegExp('^' + req.body.DesignationId, 'i');
    }
    if (req.body.status) {
        condition.status = req.body.status; // new RegExp('^' + req.body.status, 'i');
    }
    if (req.body.DesignationName) {
        condition.DesignationName = new RegExp('^' + req.body.DesignationName, 'i');
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
    console.log("search Designation API condition Is!--->", condition);
    try {
        const DesignationData: any = await DesignationModel.find(condition).populate("privilege").populate("createdBy").sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        const totalCount = await DesignationModel.count(condition);
        console.log("total count of search privilege is==>", totalCount);
        const totalPage = Math.ceil(totalCount / limitValue);
        const options = {
            path: 'privilege.createdBy',
            model: 'Admin'
        };

        DesignationModel.populate(DesignationData, options, function (err, projects) {
            // res.json(projects);
            if (Object.keys(DesignationData).length > 0) {
                res.status(200).json({ projects, totalPage });
            } else {
                res.status(200).json({ success: "No Data found", projects });
            }
        });
        // });
        //  console.log("total Page in search privilege filtered===>", totalPage);
        // if (Object.keys(DesignationData).length > 0) {
        //     res.status(200).json({ DesignationData, totalPage });
        // } else {
        //     res.status(200).json({ success: "No Data found", DesignationData });
        // }
    } catch (error) {
        res.status(500).json(error);
    }
};


export let searchDesignation = async (req: Request, res: Response) => {
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
        condition.createdBy.userName = new RegExp('^' + req.body.createdBy, 'i');
    }
    console.log("search Privileges API condition Is!--->", condition);
    try {
        const DesignationData: any = await DesignationModel.find(condition).populate('createdBy').populate('privilege').sort({ createdAt: -1 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        const totalCount = await DesignationModel.count(condition);
        console.log("total count of search privilege is==>", totalCount);
        const totalPage = Math.ceil(totalCount / limitValue);
        console.log("total Page in search privilege filtered===>", totalPage);
        const options = {
            path: 'privilege.createdBy',
            model: 'Admin'
        };

        DesignationModel.populate(DesignationData, options, function (err, projects) {
            // res.json(projects);
            if (Object.keys(DesignationData).length > 0) {
                res.status(200).json({ projects, totalPage });
            } else {
                res.status(200).json({ success: "No Data found", projects });
            }
        });
        // if (Object.keys(DesignationData).length > 0) {
        //     res.status(200).json({ DesignationData, totalPage });
        // } else {
        //     res.status(200).json({ success: "No Data found", DesignationData });
        // }
    }
    catch (error) {
        res.status(500).send(error);
    }
};

export let removeDesignation = async (req: Request, res: Response) => {
    console.log("body under removePrivilege--->", req.body);
    try {
        const DesignationData: any = await DesignationModel.findByIdAndRemove(mongoose.Types.ObjectId(req.body.DesignationId));
        res.status(200).json('Remove Successfully!');
    }
    catch (error) {
        res.status(500).json(error);
    }
};
export const updateDesignation = async (req: Request, res: Response) => {
    try {
        await DesignationModel.findOneAndUpdate({ _id: req.body._id },
            {
                $set: {
                    DesignationName: req.body.DesignationName,
                    Description: req.body.Description,
                    privilege: req.body.privilege,
                    status: req.body.status
                }

            }, { new: true }, (err, data: any) => {
                if (data) {
                    const _result = data.toJSON();
                    const obj = {
                        DesignationName: _result.DesignationName,
                        Description: _result.Description,
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

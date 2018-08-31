import express from 'express';
import { Request, Response, NextFunction } from 'express';
import DepartmentModel from '../employee/DepartmentModel';
import moment from 'moment-timezone';
import decoded from 'jwt-decode';
import shortid from "shortid";
import mongoose from 'mongoose';
import Admin from "../admin/admin.model";

export let addDepartment = async (req: Request, res: Response) => {
    console.log("you are in create privilege controller and body is-->", req.body);
    try {
        const id = shortid.generate();
        console.log("hii", req.body.decoded._id);
        const DesignationData = new DepartmentModel({
            DepartmentId: id,
            DepartmentName: req.body.DepartmentName,
            Description: req.body.Description,
            Designation: req.body.Designation,
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


export let getDepartment = async (req: Request, res: Response) => {
    let skip_Value;
    let condition: any = {};
    let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
    if (req.query.page != undefined && req.query.page > 1) {
        skip_Value = limitValue * (req.query.page - 1);
    } else { skip_Value = 0; }
    if (req.query.limit != undefined) {
        limitValue = parseInt(req.query.limit);
    }
    if (req.body.DepartmentId) {
        condition.DepartmentId = new RegExp('^' + req.body.DepartmentId, 'i');
    }
    if (req.body.status) {
        condition.status = req.body.status; // new RegExp('^' + req.body.status, 'i');
    }
    if (req.body.DepartmentName) {
        condition.DepartmentName = new RegExp('^' + req.body.DepartmentName, 'i');
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
    try {
        const DepartmentData: any = await DepartmentModel.find(condition).populate("Designation").populate("createdBy").sort({ createdAt: -1 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        const totalCount = await DepartmentModel.count({});
        console.log("total count of search privilege is==>", totalCount);
        const totalPage = Math.ceil(totalCount / limitValue);
        console.log("total Page in search privilege filtered===>", totalPage);
        const options = {
            path: 'Designation.privilege',
            model: 'privilege'
        };
        DepartmentModel.populate(DepartmentData, options, function (err, projects) {
            const options2 = {
            path: 'Designation.createdBy',
            model: 'Admin'
        };
        DepartmentModel.populate(DepartmentData, options2, function (err, projects) {

            // res.json(projects);
            if (Object.keys(DepartmentData).length > 0) {
                res.status(200).json({ projects, totalPage });
            } else {
                res.status(200).json({ success: "No Data found", projects });
            }
        });
    });
        // if (Object.keys(DepartmentData).length > 0) {
        //     res.status(200).json({ DepartmentData, totalPage });
        // } else {
        //     res.status(200).json({ success: "No Data found", DepartmentData });
        // }
    } catch (error) {
        res.status(500).json(error);
    }
};


export let removeDepartment = async (req: Request, res: Response) => {
    console.log("body under removePrivilege--->", req.body);
    try {
        const DepartmentData: any = await DepartmentModel.findByIdAndRemove(mongoose.Types.ObjectId(req.body.DepartmentId));
        res.status(200).json('Remove Successfully!');
    }
    catch (error) {
        res.status(500).json(error);
    }
};
export const updateDepartment = async (req: Request, res: Response) => {
    try {
        await DepartmentModel.findOneAndUpdate({ _id: req.body._id },
            {
                $set: {
                    DepartmentName: req.body.DepartmentName,
                    Description: req.body.Description,
                    Designation: req.body.Designation,
                    status: req.body.status,
                }

            }, { new: true }, (err, data: any) => {
                if (data) {
                    const _result = data.toJSON();
                    const obj = {
                        DepartmentName: _result.DepartmentName,
                        Description: _result.Description,
                        Designation: _result.Designation,
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

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bankModels_1 = __importDefault(require("./bankModels"));
const bidModels_1 = __importDefault(require("./bidModels"));
const requestIp = require('request-ip');
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const async_1 = __importDefault(require("async"));
exports.jwt_secret = "ADIOS AMIGOS";
const types_1 = require("../../socket/types");
const notifyControllers_1 = require("../notification/notifyControllers");
const deviceModel_1 = __importDefault(require("../notification/deviceModel"));
const app = express_1.default();
const constant_1 = __importDefault(require("../config/constant"));
exports.getpackage = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let skip_Value;
        let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
        if (req.query.page != undefined && req.query.page > 1) {
            skip_Value = limitValue * (req.query.page - 1);
        }
        else {
            skip_Value = 0;
        }
        if (req.query.limit != undefined) {
            limitValue = parseInt(req.query.limit);
        }
        const condition = {};
        if (req.body.bidPackageName) {
            condition.bidPackageName = new RegExp('^' + req.body.bidPackageName, "i");
        }
        if (req.body.noOfBids) {
            condition.noOfBids = new RegExp('^' + req.body.noOfBids, "i");
        }
        if (req.body.amount) {
            condition.amount = new RegExp('^' + req.body.amount, "i");
        }
        if (req.body.createdBy) {
            condition["createdBy.userName"] = {
                $regex: `${req.body.createdBy}`, $options: 'i'
            };
        }
        if (req.body.createdAt) {
            const searchDate = moment_timezone_1.default(req.body.createdAt).format('YYYY-MM-DD') + "T00:00:00.000";
            const searchGtDate = moment_timezone_1.default(req.body.createdAt).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
            // '$lt': '2017-05-06T00:00:00Z'
            //  "2018-04-24T20:15:35.142Z"
            let value = {};
            value = {
                '$lt': searchGtDate,
                '$gte': searchDate
            };
            condition.createdAt = value;
        }
        yield bidModels_1.default.find(condition, { __v: 0 }, (err, data) => __awaiter(this, void 0, void 0, function* () {
            console.log(`user:----`, err, data);
            if (data) {
                const count = yield bidModels_1.default.count(condition);
                console.log('count----->', count, limitValue);
                const totalPages = Math.ceil(count / limitValue);
                console.log('totalpage', totalPages);
                res.status(200).json({ data, totalPages });
            }
            else {
                res.status(400).json("Cannot find data");
            }
        })).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        // console.log("get Package condition is:", condition);
        // const result = await bidmongo.find(condition, {__v: 0 });
        // const count = await bidmongo.count(condition);
        // const totalPage = Math.ceil(count / limitValue);
        // res.status(200).json({result, totalPage});
    }
    catch (error) {
        console.log("Error Found");
        res.status(500).json(error);
    }
});
exports.getbank = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let skip_Value;
        let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
        if (req.query.page != undefined && req.query.page > 1) {
            skip_Value = limitValue * (req.query.page - 1);
        }
        else {
            skip_Value = 0;
        }
        if (req.query.limit != undefined) {
            limitValue = parseInt(req.query.limit);
        }
        const condition = {};
        if (req.body.bankName) {
            condition.bankName = { $regex: `${req.body.bankName}`, $options: 'i' };
            // condition.bankName = new RegExp('^' + req.body.bankName, "i");
        }
        if (req.body.bankShortName) {
            condition.bankShortName = { $regex: `${req.body.bankShortName}`, $options: 'i' };
            // new RegExp('^' + req.body.bankShortName, "i");
        }
        if (req.body.createdBy) {
            condition["createdBy.name"] = {
                $regex: `${req.body.createdBy}`, $options: 'i'
            };
        }
        if (req.body.createdAt) {
            const searchDate = moment_timezone_1.default(req.body.createdAt).format('YYYY-MM-DD') + "T00:00:00.000";
            const searchGtDate = moment_timezone_1.default(req.body.createdAt).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
            // '$lt': '2017-05-06T00:00:00Z'
            //  "2018-04-24T20:15:35.142Z"
            let value = {};
            value = {
                '$lt': searchGtDate,
                '$gte': searchDate
            };
            condition.createdAt = value;
        }
        console.log(" ---- ", condition);
        yield bankModels_1.default.find(condition, { __v: 0 }, (err, data) => __awaiter(this, void 0, void 0, function* () {
            console.log(`user:----`, err, data);
            if (data) {
                const count = yield bankModels_1.default.count(condition);
                console.log('count----->', count, limitValue);
                const totalPages = Math.ceil(count / limitValue);
                console.log('totalpage', totalPages);
                res.status(200).json({ data, totalPages });
            }
            else {
                res.status(400).json("Cannot find data");
            }
        })).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        // console.log("get Package condition is:", condition);
        // const result = await bidmongo.find(condition, {__v: 0 });
        // const count = await bidmongo.count(condition);
        // const totalPage = Math.ceil(count / limitValue);
        // res.status(200).json({result, totalPage});
    }
    catch (error) {
        console.log("Error Found");
        res.status(500).json(error);
    }
});
exports.addpackage = (req, res) => {
    if (req.body.bidPackageName && req.body.noOfBids && req.body.amount) {
        bidModels_1.default.findOne({ bidPackageName: req.body.bidPackageName }, (err, result) => __awaiter(this, void 0, void 0, function* () {
            console.log("result ---->", result);
            if (err) {
                res.status(500).json(err);
            }
            else if (result) {
                console.log('in else result');
                res.status(400).json({
                    msg: "Package Already exist"
                });
            }
            else {
                const ip = req.headers['x-forwarded-for'];
                const userIp = ip.split(",")[0];
                console.log('in else save ');
                console.log('req.-------->', req.body);
                console.log("--", req.body.decoded);
                const adminData = yield admin_model_1.default.findById(mongoose_1.default.Types.ObjectId(req.body.decoded._id));
                const user = new bidModels_1.default({
                    bidPackageName: req.body.bidPackageName,
                    noOfBids: req.body.noOfBids,
                    amount: req.body.amount,
                    status: req.body.status,
                    createdBy: {
                        name: adminData.userName,
                        img: adminData.picture,
                        ip: userIp
                    }
                });
                user.save((err, data) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log("err=", err);
                        res.json({
                            err: err
                        });
                    }
                    else if (data) {
                        const obj = {
                            bidPackageName: data.bidPackageName,
                            noOfBids: data.noOfBids,
                            amount: data.amount,
                            createdBy: data.createdBy,
                            status: data.status,
                            msg: "Package added successfully",
                        };
                        let registeredUsers = yield deviceModel_1.default.find();
                        async_1.default.forEach(registeredUsers, (fcmUser) => __awaiter(this, void 0, void 0, function* () {
                            let info = {};
                            let obj = {
                                title: 'new-transition',
                                notificationType: types_1.Types.BID_PACKAGE_UPDATE,
                                content: 'update-bid-package',
                                data: {
                                    "type": types_1.Types.BID_PACKAGE_UPDATE,
                                    "_id": data._id,
                                    "bidPackageName": data.bidPackageName,
                                    "noOfBids": data.noOfBids,
                                    "amount": data.amount,
                                    "status": data.status
                                }
                            };
                            yield notifyControllers_1.sendNotification(obj, info, fcmUser.token, (err, data) => {
                            });
                        }));
                        res.status(200).json({
                            obj
                        });
                    }
                }));
            }
        }));
    }
    else {
        res.status(406).json({
            statusCode: 406,
            msg: "fill all details correctly",
        });
    }
};
exports.addbank = (req, res) => {
    // console.log("Signup ", req.body);
    if (req.body.bankName && req.body.bankShortName) {
        bankModels_1.default.findOne({ bankName: req.body.bankName }, (err, result) => __awaiter(this, void 0, void 0, function* () {
            console.log("result ---->", result);
            if (err) {
                console.log('in iff err');
                res.status(500).json(err);
            }
            else if (result) {
                console.log('in else result');
                res.status(400).json({
                    msg: "Bank Already exist"
                });
            }
            else {
                const ip = req.headers['x-forwarded-for'];
                const userIp = ip.split(",")[0];
                console.log('in else save ');
                console.log('req.-------->', req.body);
                req.body.picture = constant_1.default.url + req.file.filename;
                console.log("--", req.body.decoded);
                const adminData = yield admin_model_1.default.findById(mongoose_1.default.Types.ObjectId(req.body.decoded._id));
                const user = new bankModels_1.default({
                    bankName: req.body.bankName,
                    bankShortName: req.body.bankShortName,
                    picture: req.body.picture,
                    status: req.body.status,
                    createdBy: {
                        name: adminData.userName,
                        img: adminData.picture,
                        ip: userIp
                    }
                });
                user.save((err, data) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log("err=", err);
                        res.json({
                            err: err
                        });
                    }
                    else if (data) {
                        const obj = {
                            bankeName: data.bankName,
                            bankShortName: data.bankShortName,
                            picture: data.picture,
                            createdBy: data.createdBy,
                            status: data.status,
                            msg: "Bank added successfully",
                        };
                        res.status(200).json({
                            obj
                        });
                    }
                }));
            }
        }));
    }
    else {
        res.status(406).json({
            statusCode: 406,
            msg: "fill all details correctly",
        });
    }
};
exports.editBank = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("body in editBank.....", req.body, req.file);
    let picture = '';
    if (req.file) {
        picture = constant_1.default.url + req.file.filename;
        console.log("body picture in editBank.....", picture);
    }
    try {
        let obj = {};
        if (req.file) {
            obj.picture = picture;
        }
        if (req.body.bankName) {
            obj.bankName = req.body.bankName;
        }
        if (req.body.bankShortName) {
            obj.bankShortName = req.body.bankShortName;
        }
        if (req.body.status) {
            obj.status = req.body.status;
        }
        console.log("editBnk obj else{}--->", obj);
        const bankData = yield bankModels_1.default.findByIdAndUpdate({ _id: req.body.bankID }, { $set: obj }, { new: true });
        res.status(200).json(bankData);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.removeBank = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        console.log("body n remove_Bnak==", req.body);
        const bankData = yield bankModels_1.default.findByIdAndRemove(mongoose_1.default.Types.ObjectId(req.body.bankID));
        res.status(200).json("Bank Remove Succesfully!");
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.updatePackage = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("body n updt_pkg==>", req.body);
    let obj = {};
    try {
        if (req.body.bidPackageName) {
            obj.bidPackageName = req.body.bidPackageName;
        }
        if (req.body.noOfBids) {
            obj.noOfBids = req.body.noOfBids;
        }
        if (req.body.amount) {
            obj.amount = req.body.amount;
        }
        if (req.body.status === true || req.body.status === false) {
            obj.status = req.body.status;
        }
        console.log("obj in update packages is===>", obj);
        const updateBidPackages = yield bidModels_1.default.findByIdAndUpdate(mongoose_1.default.Types.ObjectId(req.body.bidID), { $set: obj }, { new: true });
        console.log("updated Data---------->", updateBidPackages);
        const adminData = yield admin_model_1.default.findById(mongoose_1.default.Types.ObjectId(req.body.decoded._id));
        let registeredUsers = yield deviceModel_1.default.find(); // , async (err: any, notify: any) => {
        async_1.default.forEach(registeredUsers, (fcmUser) => __awaiter(this, void 0, void 0, function* () {
            let info = {};
            let obj = {
                title: 'new-transition',
                notificationType: types_1.Types.BID_PACKAGE_UPDATE,
                content: 'update-bid-package',
                data: {
                    "type": types_1.Types.BID_PACKAGE_UPDATE,
                    "_id": updateBidPackages._id,
                    "bidPackageName": updateBidPackages.bidPackageName,
                    "noOfBids": updateBidPackages.noOfBids,
                    "amount": updateBidPackages.amount,
                    "status": updateBidPackages.status
                }
            };
            yield notifyControllers_1.sendNotification(obj, info, fcmUser.token, (err, data) => {
            });
        }));
        res.status(200).json({ msg: "Package update Successfully!", updateBidPackages });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.removePackage = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        console.log("body n remove_pkg==", req.body);
        const bidData = yield bidModels_1.default.findByIdAndRemove(mongoose_1.default.Types.ObjectId(req.body.bidID));
        let registeredUsers = yield deviceModel_1.default.find();
        async_1.default.forEach(registeredUsers, (fcmUser) => __awaiter(this, void 0, void 0, function* () {
            let info = {};
            let obj = {
                title: 'new-transition',
                notificationType: types_1.Types.BID_PACKAGE_UPDATE,
                content: 'update-bid-package',
                data: {
                    "type": types_1.Types.BID_PACKAGE_DELETE,
                    "_id": req.body.bidID,
                }
            };
            yield notifyControllers_1.sendNotification(obj, info, fcmUser.token, (err, data) => {
            });
        }));
        res.status(200).json({ msg: "Remove Succesfully!" });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
//# sourceMappingURL=bankControllers.js.map
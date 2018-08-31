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
const privilegeModel_1 = __importDefault(require("./privilegeModel"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const mongoose_1 = __importDefault(require("mongoose"));
const shortid_1 = __importDefault(require("shortid"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
/**
 * employee privileges create API.
 */
exports.priviledges = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("you are in create privilege controller and body is-->", req.body);
    try {
        // const ip: any = req.headers['x-forwarded-for'];
        // const userIp = ip.split(",")[0];
        const id = shortid_1.default.generate();
        console.log("hii", req.body.decoded._id);
        const privilegeData = new privilegeModel_1.default({
            PrivilegeId: id,
            privilegeName: req.body.privilegeName,
            description: req.body.description,
            privilege: req.body.privilege,
            status: req.body.status,
            createdBy: req.body.decoded._id,
        });
        yield privilegeData.save();
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
});
/**
 * employee privileges filter API.
 */
exports.searchPrivilege = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("***body**privileges filter==>", req.body);
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
    let condition = {};
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
        const searchDate = moment_timezone_1.default(req.body.createdAt).format('YYYY-MM-DD') + "T00:00:00.000";
        const searchGtDate = moment_timezone_1.default(req.body.createdAt).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
        let value = {};
        value = {
            '$lt': searchGtDate,
            '$gte': searchDate
        };
        condition.createdAt = value;
    }
    if (req.body.createdBy) {
        const hii = yield admin_model_1.default.find({ userName: new RegExp('^' + req.body.createdBy, 'i') }, { userName: 1 });
        if (hii.length) {
            condition.createdBy = hii[0]._id;
        }
        else {
            condition.createdBy = "5b29ee7b9e54c02441c16546";
        }
    }
    console.log("search Privileges API condition Is!--->", condition);
    try {
        const privilegeData = yield privilegeModel_1.default.find(condition).populate('createdBy').sort({ createdAt: -1 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        const totalCount = yield privilegeModel_1.default.count(condition);
        console.log("total count of search privilege is==>", totalCount);
        const totalPage = Math.ceil(totalCount / limitValue);
        console.log("total Page in search privilege filtered===>", totalPage);
        if (Object.keys(privilegeData).length > 0) {
            res.status(200).json({ privilegeData, totalPage });
        }
        else {
            res.status(200).json({ success: "No Data found", privilegeData });
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
});
/**
 * Delete employee privileges API.
 *
 */
exports.removePrivilege = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("body under removePrivilege--->", req.body);
    try {
        const privilegeData = yield privilegeModel_1.default.findByIdAndRemove(mongoose_1.default.Types.ObjectId(req.body.privilegeId));
        res.status(200).json('Remove Successfully!');
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.updatePrivilege = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield privilegeModel_1.default.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                privilegeName: req.body.privilegeName,
                description: req.body.description,
                privilege: req.body.privilege,
                status: req.body.status,
            }
        }, { new: true }, (err, data) => {
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
});
//# sourceMappingURL=privilegeController.js.map
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
const DepartmentModel_1 = __importDefault(require("../employee/DepartmentModel"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const shortid_1 = __importDefault(require("shortid"));
const mongoose_1 = __importDefault(require("mongoose"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
exports.addDepartment = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("you are in create privilege controller and body is-->", req.body);
    try {
        const id = shortid_1.default.generate();
        console.log("hii", req.body.decoded._id);
        const DesignationData = new DepartmentModel_1.default({
            DepartmentId: id,
            DepartmentName: req.body.DepartmentName,
            Description: req.body.Description,
            Designation: req.body.Designation,
            status: req.body.status,
            createdBy: req.body.decoded._id,
        });
        yield DesignationData.save();
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
});
exports.getDepartment = (req, res) => __awaiter(this, void 0, void 0, function* () {
    let skip_Value;
    let condition = {};
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
    try {
        const DepartmentData = yield DepartmentModel_1.default.find(condition).populate("Designation").populate("createdBy").sort({ createdAt: -1 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        const totalCount = yield DepartmentModel_1.default.count({});
        console.log("total count of search privilege is==>", totalCount);
        const totalPage = Math.ceil(totalCount / limitValue);
        console.log("total Page in search privilege filtered===>", totalPage);
        const options = {
            path: 'Designation.privilege',
            model: 'privilege'
        };
        DepartmentModel_1.default.populate(DepartmentData, options, function (err, projects) {
            const options2 = {
                path: 'Designation.createdBy',
                model: 'Admin'
            };
            DepartmentModel_1.default.populate(DepartmentData, options2, function (err, projects) {
                // res.json(projects);
                if (Object.keys(DepartmentData).length > 0) {
                    res.status(200).json({ projects, totalPage });
                }
                else {
                    res.status(200).json({ success: "No Data found", projects });
                }
            });
        });
        // if (Object.keys(DepartmentData).length > 0) {
        //     res.status(200).json({ DepartmentData, totalPage });
        // } else {
        //     res.status(200).json({ success: "No Data found", DepartmentData });
        // }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.removeDepartment = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("body under removePrivilege--->", req.body);
    try {
        const DepartmentData = yield DepartmentModel_1.default.findByIdAndRemove(mongoose_1.default.Types.ObjectId(req.body.DepartmentId));
        res.status(200).json('Remove Successfully!');
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.updateDepartment = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield DepartmentModel_1.default.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                DepartmentName: req.body.DepartmentName,
                Description: req.body.Description,
                Designation: req.body.Designation,
                status: req.body.status,
            }
        }, { new: true }, (err, data) => {
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
});
//# sourceMappingURL=DepartmentController.js.map
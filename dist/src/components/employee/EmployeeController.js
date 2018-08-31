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
const EmployeeModel_1 = __importDefault(require("../employee/EmployeeModel"));
const DesignationModel_1 = __importDefault(require("../employee/DesignationModel"));
const DepartmentModel_1 = __importDefault(require("../employee/DepartmentModel"));
const privilegeModel_1 = __importDefault(require("../employee/privilegeModel"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const shortid_1 = __importDefault(require("shortid"));
const mongoose_1 = __importDefault(require("mongoose"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const qr_image_1 = __importDefault(require("qr-image"));
const async_1 = __importDefault(require("async"));
const utility_1 = require("../util/utility");
exports.addEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("you are in create privilege controller and body is-->", req.body);
    try {
        const id = shortid_1.default.generate();
        const json = {
            email: req.body.email,
            name: req.body.EmployeeName,
            id: id
        };
        const image = qr_image_1.default.imageSync(JSON.stringify(json), { type: 'png', size: 10 });
        // var gfs = Grid(mongoose.connection.db, mongoose.mongo);
        // var fileId = new mongoose.mongo.ObjectId();
        // const id = shortid.generate();
        const ww = require("fs").writeFile("src/public/images/out" + id + ".png", image, 'base64', function (err, ss) {
            console.log("check data ", err);
            console.log("ss", ss);
        });
        console.log("hii", req.body.decoded._id);
        const EmployeeData = new EmployeeModel_1.default({
            EmployeeId: id,
            EmployeeName: req.body.EmployeeName,
            Designation: req.body.Designation,
            Department: req.body.Department,
            Privileges: req.body.Privileges,
            email: req.body.email,
            Address: req.body.Address,
            TownShip: req.body.TownShip,
            DivisionORstate: req.body.DivisionORstate,
            phoneNo1: req.body.phoneNo1,
            phoneNo2: req.body.phoneNo2,
            img: req.file.filename,
            img1: "out" + id + ".png",
            qrId: id,
            status: req.body.status,
            createdBy: req.body.decoded._id,
            employeetype: "Manual"
        });
        yield EmployeeData.save();
        console.log(Object.keys(EmployeeData).length);
        if (Object.keys(EmployeeData).length > 0) {
            res.status(201).json(EmployeeData);
        }
        else {
            res.status(400).json({ msg: "Please fill all detail first!" });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
    if (req.body.EmployeeName) {
        condition.EmployeeName = new RegExp('^' + req.body.EmployeeName, 'i');
    }
    if (req.body.email) {
        condition.email = new RegExp('^' + req.body.email, 'i');
    }
    if (req.body.EmployeeId) {
        condition.EmployeeId = new RegExp('^' + req.body.EmployeeId, 'i');
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
    if (req.body.status) {
        condition.status = req.body.status; // new RegExp('^' + req.body.status, 'i');
    }
    console.log("search Privileges API condition Is!--->", condition);
    try {
        const EmployeeData = yield EmployeeModel_1.default.find(condition).populate("Designation").populate("Department").populate("Privileges").populate("createdBy").sort({ createdAt: -1 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        const totalCount = yield EmployeeModel_1.default.count({});
        console.log("total count of search privilege is==>", totalCount);
        const totalPage = Math.ceil(totalCount / limitValue);
        console.log("total Page in search privilege filtered===>", totalPage);
        const employeeWithStatus = [];
        async_1.default.forEach(EmployeeData, (user, cb) => __awaiter(this, void 0, void 0, function* () {
            // let dataFromAdminTable: any = await Admin.findOne({ email: user.email });
            // if (dataFromAdminTable)
            employeeWithStatus.push(Object.assign({}, user.toObject(), { online: utility_1.getUserOnlineStatus(user.id) }));
            // else
            //     employeeWithStatus.push({ ...user.toObject(), online: false });
            cb();
        }), (err) => {
            if (Object.keys(EmployeeData).length > 0) {
                res.status(200).json({ EmployeeData: employeeWithStatus, totalPage });
            }
            else {
                res.status(200).json({ success: "No Data found", EmployeeData: employeeWithStatus });
            }
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getallDesignation = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        DesignationModel_1.default.find({}, {
            DesignationName: 1,
        }, (err, data) => {
            if (err)
                throw err;
            else {
                if (data.length) {
                    res.status(200).send(data);
                }
                else {
                    res.status(200).send("data not found");
                }
            }
        });
    }
    catch (error) {
        res.status(501).json(error);
    }
});
exports.getallDepartment = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        DepartmentModel_1.default.find({}, {
            DepartmentName: 1,
        }, (err, data) => {
            if (err)
                throw err;
            else {
                if (data.length) {
                    res.status(200).send(data);
                }
                else {
                    res.status(200).send("data not found");
                }
            }
        });
    }
    catch (error) {
        res.status(501).json(error);
    }
});
exports.getallPrivileges = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        privilegeModel_1.default.find({}, {
            privilegeName: 1,
        }, (err, data) => {
            if (err)
                throw err;
            else {
                if (data.length) {
                    res.status(200).send(data);
                }
                else {
                    res.status(200).send("data not found");
                }
            }
        });
    }
    catch (error) {
        res.status(501).json(error);
    }
});
exports.removeEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("body under removePrivilege--->", req.body);
    try {
        const EmployeeData = yield EmployeeModel_1.default.findByIdAndRemove(mongoose_1.default.Types.ObjectId(req.body.EmployeeId));
        res.status(200).json('Remove Successfully!');
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.updateEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield EmployeeModel_1.default.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                EmployeeName: req.body.EmployeeName,
                Designation: req.body.Designation,
                Department: req.body.Department,
                Privileges: req.body.Privileges,
                email: req.body.email,
                Address: req.body.Address,
                TownShip: req.body.TownShip,
                DivisionORstate: req.body.DivisionORstate,
                phoneNo1: req.body.phoneNo1,
                phoneNo2: req.body.phoneNo2,
                img: req.file.filename,
                status: req.body.status,
            }
        }, { new: true }, (err, data) => {
            if (data) {
                const _result = data.toJSON();
                const obj = {
                    EmployeeName: _result.EmployeeName,
                    Designation: _result.Designation,
                    Department: _result.Department,
                    Privileges: _result.Privileges,
                    email: _result.email,
                    Address: _result.Address,
                    TownShip: _result.TownShip,
                    DivisionORstate: _result.DivisionORstate,
                    phoneNo1: _result.phoneNo1,
                    phoneNo2: _result.phoneNo2,
                    img: _result.img,
                    status: _result.status,
                };
                res.status(200).json(obj);
            }
            else {
                res.status(400).json({ msg: "Not updated" });
            }
        });
    }
    catch (Error) {
        res.status(500).json(Error);
    }
});
//# sourceMappingURL=EmployeeController.js.map
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
const admin_model_1 = __importDefault(require("./admin.model"));
const userModels_1 = __importDefault(require("../user/userModels"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const settingModel_1 = __importDefault(require("../settings/settingModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import admin from "../admin/admin.model";
const util_1 = require("../util");
const async_1 = __importDefault(require("async"));
const deviceModel_1 = __importDefault(require("../notification/deviceModel"));
const notifyControllers_1 = require("../notification/notifyControllers");
exports.jwt_secret = "ADIOS AMIGOS";
const base_64_1 = __importDefault(require("base-64"));
const utf8_1 = __importDefault(require("utf8"));
const mongoose_1 = __importDefault(require("mongoose"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const constant_1 = __importDefault(require("../config/constant"));
const notifyModels_1 = __importDefault(require("../notification/notifyModels"));
const utility_1 = require("../util/utility");
const EmployeeModel_1 = __importDefault(require("../employee/EmployeeModel"));
// import {default as reset_password} from "../config/letant"
// import Log from "../log/log.model";
// import { throws } from "assert";
/**
 * Admin signup controller.
 */
// export let createAdmin = (req: Request, res: Response) => {
//     // console.log("you are in createAdmin API------>",req.body);
//     if (!req.body.email || !req.body.password) {
//         return res.status(400).json("arguments missing");
//     } else {
//         bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
//                 // var hashedPassword = bcrypt.hashSync(req.body.password, 8);
//                 console.log(hashedPassword);
//                 const admin = new Admin({
//                     email: req.body.email,
//                     password: hashedPassword,
//                 });
//                 admin.save((err, value) => {
//                     if (err) {
//                         if (err.code == 11000) {
//                             return res.status(400).json("username already exists");
//                         } else {
//                             return res.status(400).json(err);
//                         }
//                     } else if (value) {
//                         const payload = {
//                             email: value.toJSON().email,
//                             _id: value.toJSON()._id
//                         };
//                         const token = jwt.sign(payload, jwt_secret, {
//                             algorithm: "HS384",
//                             expiresIn: 36000,
//                             issuer: "vivek"
//                         });
//                         return res.status(201).json({
//                             token: token,
//                             msg: 'AdminUser Created Successfully', value
//                         });
//                     }
//                 });
//             });
//         });
//     }
// };
// /**
//  * Admin signup.
//  */
exports.getAdminList = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const adminList = yield admin_model_1.default.find({}, { password: 0 });
        console.log("decode token data", adminList);
        //  console.log(`adminList---${req.user}`);;
        res.status(200).json(adminList);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
/**
 * Admin login controller.
 */
// console.log("moment", moment().add(20, 'm').tz('Asia/Kolkata').format());
exports.adminLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const auth = req.headers.authorization;
    if (auth) {
        console.log('auth is-->', auth);
        const dta = auth.split("Basic");
        console.log("basic is------>", dta[0], +"encodestring is---->" + dta[1]);
        const bytes = base_64_1.default.decode(dta[1]);
        const text = utf8_1.default.decode(bytes);
        // console.log("text is---->",text);
        const data = text.split(":");
        // console.log("data is-->",data);
        //  const decryptdata = encrypt.split(":");
        const email = data[0].toLowerCase();
        const password = data[1];
        console.log("you are in Admin_Login Controller");
        if (!email || !password) {
            return res.status(400).json("arguments missing");
        }
        else {
            try {
                const admin = yield admin_model_1.default.findOne({
                    email: email,
                }, {
                    email: 1,
                    password: 1,
                    userName: 1,
                    picture: 1,
                    img: 1,
                    Designation: 1,
                    Department: 1,
                    Privileges: 1,
                    Address: 1,
                    TownShip: 1,
                    DivisionORstate: 1,
                    phoneNo1: 1,
                    phoneNo2: 1,
                    status: true,
                }).populate("Designation").populate("Department").populate("Privileges");
                if (admin) {
                    const result = bcryptjs_1.default.compareSync(password, admin.password);
                    if (result) {
                        const userObject = admin.toObject(); // mongoose object to plain javascript object
                        delete userObject.password;
                        //  let expiry = Math.floor((Date.now() + (24 * 60 * 60 * 1000)) / 1000);
                        console.log("userObject====>", userObject);
                        const payload = {
                            email: userObject.email,
                            _id: userObject._id
                        };
                        const token = jsonwebtoken_1.default.sign(payload, exports.jwt_secret, {
                            algorithm: "HS384",
                            expiresIn: constant_1.default.expiresIn,
                            issuer: "vivek"
                        });
                        const settingData = yield settingModel_1.default.find({}, { bidSellingPrice: 1, _id: 0 });
                        console.log('settingData ---->', settingData);
                        console.log("picture--->", userObject.picture);
                        let dataromEmployee = yield EmployeeModel_1.default.findOne({ email: userObject.email });
                        console.log("dataromEmployee--->", dataromEmployee);
                        const obj = {
                            msg: "login successful",
                            userId: userObject._id,
                            token: token,
                            email: userObject.email,
                            userName: userObject.userName,
                            picture: constant_1.default.url + userObject.picture,
                            img: constant_1.default.url + userObject.img,
                            bidSellingPrice: settingData[0].bidSellingPrice,
                            ipAddress: userObject.ipAddress,
                            expiresIn: constant_1.default.expiresIn - 86400,
                            Designation: userObject.Designation,
                            Department: userObject.Department,
                            Privileges: userObject.Privileges,
                            Address: userObject.Address,
                            TownShip: userObject.TownShip,
                            DivisionORstate: userObject.DivisionORstate,
                            phoneNo1: userObject.phoneNo1,
                            phoneNo2: userObject.phoneNo2,
                            status: userObject.status,
                            employeeId: dataromEmployee ? dataromEmployee._id : '',
                        };
                        res.status(200).json(obj);
                    }
                    else {
                        res.status(401).json({ msg: "Authentication error" });
                    }
                }
                else {
                    res.status(404).json({ msg: "User does not exist" });
                }
            }
            catch (error) {
                res.status(500).json(error);
            }
        }
    }
    else {
        res.status(400).json("Authrization is not given");
    }
});
exports.uploadPicture = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        // console.log("req.body inside uoploadImage controller********", req.body.decoded);
        // console.log("==========>", req.file.filename);
        const admin = yield admin_model_1.default.findOneAndUpdate({ email: req.body.decoded.email }, { $set: { "picture": req.file.filename } });
        if (admin) {
            res.status(201).json({
                picture: constant_1.default.url + req.file.filename,
            });
        }
        else {
            res.status(404).json({ msg: "Admin does not exists" });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getAllUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        let susstr = false;
        if (req.body.userName) {
            condition.userName = new RegExp('^' + req.body.userName, "i");
        }
        if (req.body.email) {
            condition.email = new RegExp('^' + req.body.email, "i");
        }
        if (req.body.loginType) {
            condition.loginType = new RegExp('^' + req.body.loginType, "i");
        }
        // if (req.body.loginType == "Facebook") {
        //     condition.loginType = req.body.loginType;
        // }
        // if (req.body.loginType == "Manual") {
        //     condition.loginType = req.body.loginType;
        // }
        // if (req.body.loginType == "All") {
        //     condition;
        // }
        if (req.body.createdBy == "Self") {
            condition.createdBy = req.body.createdBy;
        }
        if (req.body.createdBy == "Admin") {
            condition.createdBy = req.body.createdBy;
        }
        if (req.body.createdBy == "All") {
            condition;
        }
        if (req.body.createdAt) {
            const searchDate = moment_timezone_1.default(req.body.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD') + "T00:00:00.000";
            const searchGtDate = moment_timezone_1.default(req.body.createdAt).add(1, 'd').tz('Asia/Kolkata').format('YYYY-MM-DD') + "T00:00:00.000";
            // '$lt': '2017-05-06T00:00:00Z'
            //  "2018-04-24T20:15:35.142Z"
            let value = {};
            value = {
                '$lt': searchGtDate,
                '$gte': searchDate
            };
            condition.createdAt = value;
        }
        //  if (req.body.balance) {
        //      condition.balance = new RegExp('^' + parseInt(req.body.balance), "i")
        //      console.log('balance ', condition.balance);
        //  }
        if (req.body.lastLogin) {
            console.log("req_body_lastlogin", req.body.lastLogin);
            // condition.lastLogin = moment(req.body.lastLogin).add(1, 'd').tz('Asia/Kolkata').format('YYYY-MM-DD') + "T00:00:00:000";
            const lastLoginDate = moment_timezone_1.default(req.body.lastLogin).tz('Asia/Kolkata').format('YYYY-MM-DD') + "T00:00:00.000";
            const lastLogin = moment_timezone_1.default(req.body.lastLogin).add(1, 'd').tz('Asia/Kolkata').format('YYYY-MM-DD') + "T00:00:00.000";
            // '$lt': '2017-05-06T00:00:00Z'
            //  "2018-04-24T20:15:35.142Z"
            let value = {};
            value = {
                '$lt': lastLogin,
                '$gte': lastLoginDate
            };
            condition.lastLogin = value;
        }
        if (req.body.balance || req.body.balance === 0) {
            console.log('m in balance');
            let value = {};
            // value.$lte=req.body.$lte;
            value = { $lte: req.body.balance };
            console.log('query data is????', value);
            condition.balance = value;
        }
        if (req.body.level == "Beginner") {
            console.log("level---", req.body.level);
            condition.level = req.body.level;
            console.log("level conditions is===", condition);
        }
        if (req.body.level == "Old") {
            condition.level = req.body.level;
        }
        if (req.body.level == "All") {
            condition;
        }
        if (req.body.suspend == "Yes" /*?true:false*/) {
            susstr = true;
            condition.suspend = susstr; // new RegExp('^' + st, "i")
        }
        if (req.body.suspend == "No" /*?true:false*/) {
            susstr = false;
            condition.suspend = susstr; // new RegExp('^' + st, "i")
        }
        if (req.body.suspend == "All") {
            condition;
            // console.log("req.body for suspend filter All",condition);
        }
        if (req.body.status == "Open") {
            //  condition.status = new RegExp('^' + req.body.status, "i")
            condition.status = true;
        }
        if (req.body.status == "Lock") {
            //  condition.status = new RegExp('^' + req.body.status, "i")
            condition.status = false;
        }
        if (req.body.status == "All") {
            condition;
        }
        console.log("condition is =======", condition);
        console.log("condition limitvalue is ==", limitValue);
        const userList = yield userModels_1.default.find(condition, { password: 0 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        const userListWithStatus = [];
        async_1.default.forEach(userList, (user, cb) => __awaiter(this, void 0, void 0, function* () {
            yield userListWithStatus.push(Object.assign({}, user.toObject(), { online: utility_1.getUserOnlineStatus(user.id) }));
            cb();
        }), (err) => __awaiter(this, void 0, void 0, function* () {
            const totalCount = yield userModels_1.default.count(condition);
            const totalPage = Math.ceil(totalCount / limitValue);
            //  console.log(`adminList---${req.user}`);;
            console.log("you are in getAllUsers  controller ----API--->");
            res.status(200).json({ userList: userListWithStatus, totalPage });
        }));
    }
    catch (error) {
        res.status(400).json(error);
    }
});
/**
 * get all Filtered user List.
 */
// export let getFilterUser = async (req: Request, res: Response) => {
//     console.log("you are infiltered data api", req.body);
//     try {
//         let skip_Value;
//         let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
//         if (req.query.page != undefined && req.query.page > 1) {
//             skip_Value = limitValue * (req.query.page - 1);
//         } else { skip_Value = 0; }
//         if (req.query.limit != undefined) {
//             limitValue = parseInt(req.query.limit);
//         }
//         const condition: any = {};
//         let susstr = false;
//         if (req.body.userName) {
//             condition.userName = new RegExp('^' + req.body.userName, "i");
//         }
//         if (req.body.email) {
//             condition.email = new RegExp('^' + req.body.email, "i");
//         }
//         if (req.body.loginType) {
//             condition.loginType = new RegExp('^' + req.body.loginType, "i");
//         }
//         // if (req.body.loginType == "Facebook") {
//         //     condition.loginType = req.body.loginType;
//         // }
//         // if (req.body.loginType == "Manual") {
//         //     condition.loginType = req.body.loginType;
//         // }
//         // if (req.body.loginType == "All") {
//         //     condition;
//         // }
//         if (req.body.createdBy == "Self") {
//             condition.createdBy = req.body.createdBy;
//         }
//         if (req.body.createdBy == "Admin") {
//             condition.createdBy = req.body.createdBy;
//         }
//         if (req.body.createdBy == "All") {
//             condition;
//         }
//         if (req.body.createdAt) {
//             const searchDate = moment(req.body.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD') + "T00:00:00.000";
//             const searchGtDate = moment(req.body.createdAt).add(1, 'd').tz('Asia/Kolkata').format('YYYY-MM-DD') + "T00:00:00.000";
//             // '$lt': '2017-05-06T00:00:00Z'
//             //  "2018-04-24T20:15:35.142Z"
//             let value: any = {};
//             value = {
//                 '$lt': searchGtDate,
//                 '$gte': searchDate
//             };
//             condition.createdAt = value;
//         }
//         //  if (req.body.balance) {
//         //      condition.balance = new RegExp('^' + parseInt(req.body.balance), "i")
//         //      console.log('balance ', condition.balance);
//         //  }
//         if (req.body.lastLogin) {
//             console.log("req_body_lastlogin", req.body.lastLogin);
//             // condition.lastLogin = moment(req.body.lastLogin).add(1, 'd').tz('Asia/Kolkata').format('YYYY-MM-DD') + "T00:00:00:000";
//             const lastLoginDate = moment(req.body.lastLogin).tz('Asia/Kolkata').format('YYYY-MM-DD') + "T00:00:00.000";
//             const lastLogin = moment(req.body.lastLogin).add(1, 'd').tz('Asia/Kolkata').format('YYYY-MM-DD') + "T00:00:00.000";
//             // '$lt': '2017-05-06T00:00:00Z'
//             //  "2018-04-24T20:15:35.142Z"
//             let value: any = {};
//             value = {
//                 '$lt': lastLogin,
//                 '$gte': lastLoginDate
//             };
//             condition.lastLogin = value;
//         }
//         if (req.body.balance || req.body.balance === 0) {
//             console.log('m in balance');
//             let value: any = {};
//             // value.$lte=req.body.$lte;
//             value = { $lte: req.body.balance };
//             console.log('query data is????', value);
//             condition.balance = value;
//         }
//         if (req.body.level == "Beginner") {
//             console.log("level---", req.body.level);
//             condition.level = req.body.level;
//             console.log("level conditions is===", condition);
//         }
//         if (req.body.level == "Old") {
//             condition.level = req.body.level;
//         }
//         if (req.body.level == "All") {
//             condition;
//         }
//         if (req.body.suspend == "Yes"/*?true:false*/) {
//             susstr = true;
//             condition.suspend = susstr; // new RegExp('^' + st, "i")
//         }
//         if (req.body.suspend == "No" /*?true:false*/) {
//             susstr = false;
//             condition.suspend = susstr; // new RegExp('^' + st, "i")
//         }
//         if (req.body.suspend == "All") {
//             condition;
//             // console.log("req.body for suspend filter All",condition);
//         }
//         if (req.body.status == "Open") {
//             //  condition.status = new RegExp('^' + req.body.status, "i")
//             condition.status = true;
//         }
//         if (req.body.status == "Lock") {
//             //  condition.status = new RegExp('^' + req.body.status, "i")
//             condition.status = false;
//         }
//         if (req.body.status == "All") {
//             condition;
//         }
//         console.log("condition is =======", condition);
//         const userList = await User.find(condition, { Password: 0 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
//         // console.log("userList ", userList);
//         console.log("Type of data ====>", typeof userList);
//         console.log("filterd data length===>", Object.keys(userList).length);
//         const totalCount = await User.count(condition);
//         const totalPage = Math.ceil(totalCount / limitValue);
//         if (Object.keys(userList).length > 0) {
//             //  console.log(`adminList---${req.user}`);;
//             console.log("you are filter controller ----API--->");
//             // res.status(200).json({data:userList, totalCount:count});
//             res.status(200).json({ userList, totalPage });
//         } else {
//             res.status(200).json(userList);
//         }
//     } catch (error) {
//         res.status(400).json(error);
//     }
// };
/**
 * get all admin List.
 */
exports.getAllAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const adminList = yield admin_model_1.default.find({}, { password: 0 });
        //  console.log(`adminList---${req.user}`);
        console.log("you are in getAllAdmin controller ----API--->");
        res.status(200).json(adminList);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
/**
 * get summary user List.
 */
exports.getUserSummary = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        console.log(req.body.userName);
        const summary = yield userModels_1.default.findOne({ email: req.body.email }, { password: 0, firstName: 0, lastName: 0 });
        //  console.log(`adminList---${req.user}`);
        console.log("you are in getAllAdmin controller ----API--->", summary);
        res.status(200).json(summary);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(req.body);
    try {
        // console.log("fgfgfody");
        const admin = yield admin_model_1.default.findOne({
            "email": req.body.email,
        });
        if (admin) {
            // console.log("uuuuuuuuuuuu",admin);
            const pwdMatch = bcryptjs_1.default.compareSync(req.body.password, admin.password);
            console.log("password match ---", pwdMatch);
            if (pwdMatch) {
                const adminHashedPassword = bcryptjs_1.default.hashSync(req.body.newpassword, 8);
                console.log("admin hashed password is---", adminHashedPassword);
                const updatePassword = yield admin_model_1.default.findOneAndUpdate({ "email": req.body.email }, { $set: { "password": adminHashedPassword } });
                // console.log("find update----",updatePassword);
                res.status(200).json("password Updated successfully!");
            }
            else {
                res.status(400).json("authentication error");
            }
        }
        else {
            res.status(400).json("email does not exist!");
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // console.log(req.body.userName);
    // console.log(reset_password);
    const hashedPassword = bcryptjs_1.default.hashSync('12345', 8);
    // console.log(hashedPassword);
    try {
        const updateResetPwd = yield userModels_1.default.findOneAndUpdate({ "userName": req.body.userName }, { $set: { "password": hashedPassword } });
        res.status(200).json("Password Reset Successfull");
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.UpdateBio = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const updateData = {};
    // let updateinfo: any = {}
    console.log('body ', req.body);
    try {
        console.log('update_bio body is******* ', req.body);
        if (req.body.bioStatus) {
            if (req.body.bioStatus == "enable") {
                updateData.isEnabled = true;
            }
            if (req.body.bioStatus == "disable") {
                updateData.isEnabled = false;
            }
        }
        if (req.body.Status) {
            if (req.body.Status == "open") {
                updateData.status = false;
                updateData.suspend = false;
            }
            if (req.body.Status == "lock") {
                updateData.status = true;
                updateData.suspend = true;
            }
        }
        if (req.body.suspend) {
            console.log('m in suspend');
            if (req.body.suspend == "yes") {
                updateData.suspend = true;
            }
            if (req.body.suspend == "no") {
                updateData.suspend = false;
            }
        }
        //  console.log("updt data is*******",updateData);
        console.log("updatedata length is===", typeof Object.keys(updateData).length);
        if (Object.keys(updateData).length > 0) {
            //  console.log('m in update data',updateData);
            const bioData = yield userModels_1.default.findOneAndUpdate({ "email": req.body.email }, { $set: updateData }, { new: true });
            res.status(200).json(bioData);
        }
        else {
            console.log('m else in update data');
            res.status(400).json('Somthing is mising');
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.notify = (req, res) => __awaiter(this, void 0, void 0, function* () {
    let body = req.body;
    console.log("In notify");
    let info = {};
    try {
        const ip = req.headers['x-forwarded-for'];
        const userIp = ip.split(",")[0];
        const adminData = yield admin_model_1.default.findById(mongoose_1.default.Types.ObjectId(req.body.decoded._id));
        console.log("hello", adminData);
        async_1.default.forEach(req.body.userId, (element, cb) => __awaiter(this, void 0, void 0, function* () {
            console.log("element--->", element);
            let deviceRes = yield deviceModel_1.default.findOne({ userId: element });
            console.log("Devicere", deviceRes);
            if (deviceRes) {
                let obj = {
                    title: body.title,
                    notificationType: body.notificationType,
                    content: body.content,
                    userId: element,
                    action: body.action,
                    sender: {
                        name: adminData.userName,
                        img: adminData.picture,
                        ip: userIp
                    },
                };
                console.log("hey", obj);
                notifyControllers_1.sendNotification(obj, info, deviceRes.token, (err, data) => __awaiter(this, void 0, void 0, function* () {
                    const user = new notifyModels_1.default(obj);
                    yield user.save();
                    console.log("user--->", user);
                    // cb();
                }));
            }
            else {
                res.status(400).send({ msg: 'device id not found' });
            }
            cb();
            // deviceModel.findOne({ userId: element }, (err: any, notify: any) => {
            //     console.log("res==========>", err, notify);
            //     if (err) throw err;
            //     // else {
            //     if (notify) {
            //         let obj = {
            //             title: body.title,
            //             notificationType: body.notificationType,
            //             content: body.content,
            //             userId: body.userId,
            //             action: body.action,
            //             sender: {
            //                 name: adminData.userName,
            //                 img: adminData.picture,
            //                 ip: userIp
            //             },
            //         };
            //         console.log("Notify----->", notify, notify.token);
            //         sendNotification(obj, info, notify.token, async (err: any, data: any) => {
            //             const user = new notifyModels(obj);
            //             await user.save();
            //             cb();
            //         });
            //     }
            //     else {
            //         cb();
            //     }
            //     // }
            // }, err => {
            //     console.log("In error");
            //     res.status(200).json({ msg: "Successfull" });
            // });
        }), (err) => {
            res.status(200).send({ 'Success': true });
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getNotification = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        if (req.body.notificationType) {
            condition.notificationType = { $regex: `${req.body.notificationType}`, $options: 'i' };
            // condition.bankName = new RegExp('^' + req.body.bankName, "i");
        }
        if (req.body.title) {
            condition.title = { $regex: `${req.body.title}`, $options: 'i' };
            // new RegExp('^' + req.body.bankShortName, "i");
        }
        if (req.body.content) {
            condition.content = { $regex: `${req.body.content}`, $options: 'i' };
            // new RegExp('^' + req.body.bankShortName, "i");
        }
        if (req.body._id) {
            condition._id = { $regex: `${req.body._id}`, $options: 'i' };
            // new RegExp('^' + req.body.bankShortName, "i");
        }
        if (req.body.action == "reply") {
            condition.action = { $regex: `${req.body.action}`, $options: 'i' };
        }
        if (req.body.action == "exchange") {
            condition.action = { $regex: `${req.body.action}`, $options: 'i' };
        }
        if (req.body.sender) {
            condition["sender.name"] = {
                $regex: `${req.body.sender}`, $options: 'i'
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
        yield notifyModels_1.default.find(condition, { __v: 0 }, (err, data) => __awaiter(this, void 0, void 0, function* () {
            console.log(`user:----`, err, data);
            if (data) {
                const count = yield notifyModels_1.default.count(condition);
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
    catch (Error) {
        console.log("Error Found");
        res.status(500).json(Error);
    }
});
exports.removeNotify = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        for (let i = 0; i < req.body._id.length; i++) {
            const removeNotify = yield notifyModels_1.default.findByIdAndRemove(mongoose_1.default.Types.ObjectId(req.body._id[i]));
        }
        res.status(200).json({ success: "true", removeNotify: exports.removeNotify });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.createAdmin = (req, res) => {
    // if (req.body.email && req.body.password) {
    console.log("Signup ", req.body);
    req.body.password = bcryptjs_1.default.hashSync(req.body.password, 10);
    if (req.body.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        admin_model_1.default.findOne({ email: req.body.email }, (err, result) => {
            console.log("result ---->", result);
            if (err) {
                res.status(500).json(err);
            }
            else if (result) {
                res.status(400).json({
                    msg: "Already exist"
                });
            }
            else {
                const user = new admin_model_1.default(Object.assign({}, req.body, { img: req.file.filename }));
                user.save((err, result) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log("err=", err);
                        res.json({
                            err: err
                        });
                    }
                    else if (result) {
                        const payload = {
                            email: result.toJSON().email,
                            _id: result.toJSON()._id,
                        };
                        const token = yield util_1.createToken(payload, constant_1.default.expiresIn);
                        // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                        // console.log("ip------> " + ip);
                        const _result = result.toJSON();
                        console.log("img----->", req.file, req, req.file.filename);
                        const obj = {
                            // password:_result.password,
                            token: token,
                            expiresIn: constant_1.default.expiresIn - 86400,
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
                        };
                        res.status(200).json({ obj, msg: "Success" });
                    }
                }));
            }
        });
    }
    else {
        res.status(406).json({
            statusCode: 406,
            msg: "fill email details correctley"
        });
    }
};
//     } else {
//         res.status(400).json({
//             msg: "please fill all details first"
//         });
//     }
// };
//# sourceMappingURL=admin.controller.js.map
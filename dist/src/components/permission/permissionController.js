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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const permissionModel_1 = __importDefault(require("./permissionModel"));
const async = __importStar(require("async"));
const userModels_1 = __importDefault(require("../user/userModels"));
const couponPackageModel_1 = __importDefault(require("../coupon/couponPackageModel"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const couponModel_1 = __importDefault(require("../coupon/couponModel"));
class CouponController {
    createCouponPermission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            if (body.packageId && body.userIds.length > 0 && body.decoded && body.decoded._id) {
                const permissionExist = yield permissionModel_1.default.findOne({ 'packageId': body.packageId });
                if (permissionExist) {
                    res.status(400).json({ data: 'Permission already Exist!' });
                }
                else {
                    try {
                        let userIdExist = true;
                        const packExist = yield couponPackageModel_1.default.findOne({ '_id': body.packageId });
                        async.forEach(body.userIds, (userId, cb) => __awaiter(this, void 0, void 0, function* () {
                            const userExist = yield userModels_1.default.findOne({ '_id': userId });
                            if (userExist == undefined) {
                                userIdExist = false;
                                res.status(400).json({ data: 'userId ' + userId + " doesn't exist." });
                            }
                        }));
                        const ip = req.headers['x-forwarded-for'];
                        const userIp = ip.split(",")[0];
                        const adminData = yield admin_model_1.default.findById(mongoose_1.default.Types.ObjectId(body.decoded._id));
                        const createdBy = {
                            "createdBy.name": adminData.userName,
                            "createdBy.image": adminData.picture,
                            "createdBy.ip": userIp,
                        };
                        const permissionObj = Object.assign({ packageId: body.packageId, permissionTo: body.userIds, type: 'coupon' }, createdBy);
                        const savePermission = new permissionModel_1.default(permissionObj);
                        savePermission.save((err, data) => __awaiter(this, void 0, void 0, function* () {
                            data && couponModel_1.default.update({ 'packageId': body.packageId }, { $set: { 'sendingDate': new Date() } }, { multi: true }, (err, data) => {
                                if (err) {
                                    res.status(500).json({ data: 'Try Again!' });
                                }
                                else {
                                    res.status(200).json({ data: 'Permission created!' });
                                }
                            });
                            // data && res.status(200).json({ data: 'Permission created!' });
                        }));
                    }
                    catch (err) {
                        res.status(500).json({ data: err });
                    }
                }
            }
            else {
                res.status(400).json({ data: 'Incomplete Arguments!' });
            }
        });
    }
    getAllCouponPermission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = req.body;
            let allPermissions = [];
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 10;
            let condition1 = {};
            let condition = {};
            condition1.type = { $regex: `${'coupon'}`, $options: 'i' };
            // if (req.body.permissionId) {
            //     condition1._id = { $regex: `${req.body.permissionId}`, $options: 'i' };
            // }
            if (req.body.packageName) {
                condition.name = { $regex: `${req.body.packageName}`, $options: 'i' };
            }
            if (req.body.packageOwner) {
                condition.owner = { $regex: `${req.body.packageOwner}`, $options: 'i' };
            }
            if (req.body.packageType) {
                condition.packageType = { $regex: `${req.body.packageType}`, $options: 'i' };
            }
            if (req.body.packageAmount) {
                condition.packageAmount = { $regex: `${req.body.packageAmount}`, $options: 'i' };
            }
            if (req.body.noOfCode) {
                condition.noOfCode = { $regex: `${req.body.noOfCode}`, $options: 'i' };
            }
            if (req.body.packagestatus) {
                condition.status = { $regex: `${req.body.packagestatus}`, $options: 'i' };
            }
            if (req.body.createdBy) {
                condition["createdBy.name"] = {
                    $regex: `${req.body.createdBy}`, $options: 'i'
                };
            }
            if (req.body.createdDate) {
                const searchDate = moment_timezone_1.default(req.body.createdDate).format('YYYY-MM-DD') + "T00:00:00.000";
                const searchGtDate = moment_timezone_1.default(req.body.createdDate).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
                let value = {};
                if (((new Date(searchDate)).toString() == 'Invalid Date') || ((new Date(searchGtDate)).toString() == 'Invalid Date')) {
                    res.status(200).json({ data: 'Invalid Created Date!' });
                }
                value = {
                    '$lt': searchGtDate,
                    '$gte': searchDate
                };
                condition.createdAt = value;
            }
            try {
                let permissions = yield permissionModel_1.default.find(condition1).skip((page - 1) * limit).limit(limit);
                permissionModel_1.default.find({}, (err, data) => {
                    if (!permissions) {
                        res.status(200).json({ data: [], totalCount: data.length });
                    }
                    else {
                        async.forEach(permissions, (element, cb) => __awaiter(this, void 0, void 0, function* () {
                            const coupons = yield couponPackageModel_1.default.findOne(Object.assign({ '_id': element.packageId }, condition)).select(['name', 'packageType', 'noOfCode', 'packageAmount', 'owner', 'createdBy', 'status', 'createdAt']);
                            if (!coupons) {
                                res.status(200).json({ data: [], totalCount: data.length });
                            }
                            const data1 = {
                                "permissionId": element._id,
                                "createdDate": element.createdAt,
                                "createdBy": element.createdBy,
                                "packageName": coupons.name,
                                "packageOwner": coupons.owner,
                                "packageType": coupons.packageType,
                                "packageAmount": coupons.packageAmount,
                                "noOfCode": coupons.noOfCode,
                                "packagestatus": coupons.status,
                            };
                            allPermissions = allPermissions.concat(data1);
                            cb();
                        }), err => {
                            res.status(200).json({ data: allPermissions, totalCount: data.length });
                        });
                    }
                });
            }
            catch (err) {
                res.status(500).json({ data: err });
            }
        });
    }
}
exports.default = CouponController;
//# sourceMappingURL=permissionController.js.map
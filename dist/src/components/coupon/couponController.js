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
const productModels_1 = __importDefault(require("../product/productModels"));
const couponPackageModel_1 = __importDefault(require("./couponPackageModel"));
const couponModel_1 = __importDefault(require("./couponModel"));
const async = __importStar(require("async"));
const utility_1 = require("../util/utility");
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const mwServer = require('../../socket/websocket');
class CouponController {
    createPackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            if (body.name
                && body.owner
                && body.packageType
                && body.packageAmount
                && body.fromDate
                && body.toDate
                && body.noOfCode
                && body.status
                && body.couponCode
                && body.decoded._id
                && (body.balance
                    || (body.supplierId))) {
                let createdBy;
                let isPackageExist;
                // try {
                const ip = req.headers['x-forwarded-for'];
                const userIp = ip.split(",")[0];
                const adminData = yield admin_model_1.default.findById(mongoose_1.default.Types.ObjectId(req.body.decoded._id));
                createdBy = {
                    "createdBy.name": adminData.userName,
                    "createdBy.image": adminData.picture,
                    "createdBy.ip": userIp,
                };
                isPackageExist = yield couponPackageModel_1.default.findOne({ 'name': body.name });
                if (isPackageExist) {
                    res.status(500).json({ data: 'Package Already Exist!' });
                }
                else {
                    const savePackageObj = Object.assign({ name: body.name, owner: body.owner, balance: body.balance, supplierId: body.supplierId, brandId: body.brandId, productId: body.productId, packageType: body.packageType, packageAmount: body.packageAmount, fromDate: new Date(body.fromDate), toDate: new Date(body.toDate), noOfCode: body.noOfCode, status: body.status }, createdBy);
                    const savePackage = new couponPackageModel_1.default(savePackageObj);
                    savePackage.save((err, data) => __awaiter(this, void 0, void 0, function* () {
                        if (data && body.balance == false) {
                            let queryObj = [];
                            if (body.supplierId) {
                                queryObj.push({ 'supplierName.id': body.supplierId });
                            }
                            if (body.brandId) {
                                queryObj.push({ "brand.id": body.brandId });
                            }
                            if (body.productId) {
                                queryObj.push({ "_id": body.productId });
                            }
                            const products = yield productModels_1.default.find({ $and: queryObj });
                            async.forEach(products, (product, cb) => {
                                const saveCoupon = Object.assign({ "code": body.couponCode, "image": product.image[product.image.length - 1], "productId": product._id, "sendingDate": "", "packageId": data._id, "sales": "", "promoted": "", "usedDate": "", "packageType": body.packageType, "amount": body.packageAmount }, createdBy);
                                const saveCouponObj = new couponModel_1.default(saveCoupon);
                                saveCouponObj.save((err, data) => __awaiter(this, void 0, void 0, function* () {
                                    if (err) {
                                        res.status(500).json({ data: err });
                                    }
                                    else {
                                        cb();
                                    }
                                }));
                            }, (err) => {
                            });
                            res.status(200).json({ data: 'package created!' });
                        }
                        else {
                            res.status(500).json({ data: err });
                        }
                    }));
                }
            }
            else {
                res.status(400).json({ data: 'Incomplete parameters!' });
            }
        });
    }
    updatePackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            if (body.objectId
                && body.name
                && body.owner
                && body.packageType
                && body.packageAmount
                && body.fromDate
                && body.toDate
                && body.noOfCode
                && body.status
                && body.couponCode
                && body.decoded._id
                && (body.balance
                    || (body.supplierId))) {
                let createdBy = 'name';
                let isPackageExist;
                // try {
                const ip = req.headers['x-forwarded-for'];
                const userIp = ip.split(",")[0];
                const adminData = yield admin_model_1.default.findById(mongoose_1.default.Types.ObjectId(req.body.decoded._id));
                createdBy = {
                    "createdBy.name": adminData.userName,
                    "createdBy.ip": userIp,
                    "createdBy.image": adminData.picture
                    // "createdBy.name": "admin",
                    // "createdBy.ip": "adminip",
                    // "createdBy.image": "image",
                };
                const savePackageObj = Object.assign({ name: body.name, owner: body.owner, balance: body.balance, supplierId: body.supplierId, brandId: body.brandId, productId: body.productId, packageType: body.packageType, packageAmount: body.packageAmount, fromDate: new Date(body.fromDate), toDate: new Date(body.toDate), noOfCode: body.noOfCode, status: body.status }, createdBy);
                isPackageExist = yield couponPackageModel_1.default.findOne({ '_id': body.objectId });
                let updatePackage = couponPackageModel_1.default.updateOne({ '_id': body.objectId }, { $set: Object.assign({}, savePackageObj) }, (err, data) => __awaiter(this, void 0, void 0, function* () {
                    if ((body.supplierId != isPackageExist.supplierId)
                        || (body.brandId != isPackageExist.brandId)
                        || (body.productId != isPackageExist.productId)) {
                        couponModel_1.default.remove({ 'packageId': body.objectId }, (err) => __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                res.status(200).json({ data: 'coupons deleted!' });
                            }
                            else {
                                let queryObj = [];
                                if (body.supplierId) {
                                    queryObj.push({ 'supplierName.id': body.supplierId });
                                }
                                if (body.brandId) {
                                    queryObj.push({ "brand.id": body.brandId });
                                }
                                if (body.productId) {
                                    queryObj.push({ "_id": body.productId });
                                }
                                const products = yield productModels_1.default.find({ $and: queryObj });
                                async.forEach(products, (product, cb) => __awaiter(this, void 0, void 0, function* () {
                                    const saveCoupon = Object.assign({ "code": body.couponCode, "image": product.image[product.image.length - 1], "productId": product._id, "sendingDate": "", "packageId": data._id, "sales": "", "promoted": "", "usedDate": "", "packageType": body.packageType, "amount": body.packageAmount, "createdBy": createdBy }, createdBy);
                                    const saveCouponObj = new couponModel_1.default(saveCoupon);
                                    saveCouponObj.save((err, data) => __awaiter(this, void 0, void 0, function* () {
                                        if (err) {
                                            res.status(500).json({ data: err });
                                        }
                                        else {
                                            cb();
                                        }
                                    }));
                                }), (err) => {
                                    res.status(200).json({ data: 'package updated!' });
                                });
                            }
                        }));
                    }
                    else {
                        couponModel_1.default.update({ 'packageId': body.objectId }, { $set: { 'code': body.couponCode, 'amount': body.packageAmount, 'packageType': body.packageType } }, { multi: true }, (err, data) => {
                            if (err) {
                                res.status(500).json({ data: 'Try Again!' });
                            }
                            else {
                                res.status(200).json({ data: 'package updated!' });
                            }
                        });
                    }
                }));
            }
            else {
                res.status(400).json({ data: 'Incomplete parameters!' });
            }
        });
    }
    generatePackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("websocket in coupon---------->", webServer);
            const body = req.body;
            if (body.supplierId) {
                let products = [];
                let queryObj = [];
                if (body.supplierId) {
                    queryObj.push({ 'supplierName.id': body.supplierId });
                }
                if (body.brandId) {
                    queryObj.push({ "brand.id": body.brandId });
                }
                if (body.productId) {
                    queryObj.push({ "_id": body.productId });
                }
                const data = yield productModels_1.default.find({ $and: queryObj }).select(['productNameEn', 'image']);
                let couponData = [];
                let couponCode = utility_1.CreateRandomId(3, 'coupon');
                try {
                    async.forEach(data, (element, cb) => {
                        couponData = couponData.concat({ '_id': element._id, 'image': element.image[0], "couponCode": couponCode, "permission": element.productNameEn });
                        cb();
                    });
                    res.status(200).json({ data: couponData });
                }
                catch (err) {
                    res.status(500).json({ data: err });
                }
            }
            else {
                res.status(400).json({ data: 'Incomplete Arguments!' });
            }
        });
    }
    getAllPackages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 10;
            let condition = {};
            if (req.body.name) {
                condition.name = { $regex: `${req.body.name}`, $options: 'i' };
            }
            if (req.body.owner) {
                condition.owner = { $regex: `${req.body.owner}`, $options: 'i' };
            }
            if (req.body.packageAmount) {
                condition.packageAmount = { $regex: `${req.body.packageAmount}`, $options: 'i' };
            }
            if (req.body.packageType) {
                condition.packageType = { $regex: `${req.body.packageType}`, $options: 'i' };
            }
            if (req.body.noOfCode) {
                condition.noOfCode = { $regex: `${req.body.noOfCode}`, $options: 'i' };
            }
            if (req.body.status) {
                condition.status = { $regex: `${req.body.status}`, $options: 'i' };
            }
            if (req.body.createdBy) {
                condition["createdBy.name"] = {
                    $regex: `${req.body.createdBy}`, $options: 'i'
                };
            }
            if (req.body.createdAt) {
                const searchDate = moment_timezone_1.default(req.body.createdAt).format('YYYY-MM-DD') + "T00:00:00.000";
                const searchGtDate = moment_timezone_1.default(req.body.createdAt).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
                let value = {};
                if (((new Date(searchDate)).toString() == 'Invalid Date') || ((new Date(searchGtDate)).toString() == 'Invalid Date')) {
                    res.status(200).json({ data: 'Invalid Created Date!' });
                }
                value = {
                    '$lt': searchGtDate,
                    '$gte': searchDate
                };
            }
            couponPackageModel_1.default.find({}, (err, data) => __awaiter(this, void 0, void 0, function* () {
                const packages = yield couponPackageModel_1.default.find(condition).skip((page - 1) * limit).limit(limit).select(['name', 'packageType', 'packageAmount', 'noOfCode', 'createdAt', 'owner', 'status', 'createdBy']);
                if (!packages) {
                    res.status(200).json({ data: [], totalCount: data.length });
                }
                else {
                    res.status(200).json({ data: packages, totalCount: data.length });
                }
            }));
        });
    }
    getAllCoupons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 10;
            let condition = {};
            if (req.body.code) {
                condition.code = { $regex: `${req.body.code}`, $options: 'i' };
            }
            if (req.body.sendingDate) {
                const searchDate = moment_timezone_1.default(req.body.sendingDate).format('YYYY-MM-DD') + "T00:00:00.000";
                const searchGtDate = moment_timezone_1.default(req.body.sendingDate).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
                let value = {};
                if (((new Date(searchDate)).toString() == 'Invalid Date') || ((new Date(searchGtDate)).toString() == 'Invalid Date')) {
                    res.status(200).json({ data: 'Invalid Sending Date!' });
                }
                value = {
                    '$lt': searchGtDate,
                    '$gte': searchDate
                };
                condition.sendingDate = value;
            }
            if (req.body.usedDate) {
                const searchDate = moment_timezone_1.default(req.body.usedDate).format('YYYY-MM-DD') + "T00:00:00.000";
                const searchGtDate = moment_timezone_1.default(req.body.usedDate).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
                let value = {};
                if (((new Date(searchDate)).toString() == 'Invalid Date') || ((new Date(searchGtDate)).toString() == 'Invalid Date')) {
                    res.status(200).json({ data: 'Invalid Used Date!' });
                }
                value = {
                    '$lt': searchGtDate,
                    '$gte': searchDate
                };
                condition.usedDate = value;
            }
            if (req.body.packageType) {
                condition.packageType = { $regex: `${req.body.packageType}`, $options: 'i' };
            }
            if (req.body.sales) {
                condition.sales = { $regex: `${req.body.sales}`, $options: 'i' };
            }
            if (req.body.promoted) {
                condition.promoted = { $regex: `${req.body.promoted}`, $options: 'i' };
            }
            if (req.body.amount) {
                condition.amount = { $regex: `${req.body.amount}`, $options: 'i' };
            }
            if (req.body.createdBy) {
                condition["createdBy.name"] = {
                    $regex: `${req.body.createdBy}`, $options: 'i'
                };
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
            couponModel_1.default.find({}, (err, data) => __awaiter(this, void 0, void 0, function* () {
                const allcoupon = yield couponModel_1.default.find(condition).skip((page - 1) * limit).limit(limit);
                if (!allcoupon) {
                    res.status(200).json({ data: [], totalCount: data.length });
                }
                else {
                    res.status(200).json({ data: allcoupon, totalCount: data.length });
                }
            }));
        });
    }
}
exports.default = CouponController;
//# sourceMappingURL=couponController.js.map
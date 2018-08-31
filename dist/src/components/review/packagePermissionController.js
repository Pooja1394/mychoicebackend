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
const packageModel_1 = __importDefault(require("./packageModel"));
const packagePermissionModel_1 = __importDefault(require("./packagePermissionModel"));
const productModels_1 = __importDefault(require("../product/productModels"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const async_1 = __importDefault(require("async"));
exports.jwt_secret = "jangan";
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.createReviewPackage = (req, res) => __awaiter(this, void 0, void 0, function* () {
    let packageValue = [];
    try {
        const ip = req.headers['x-forwarded-for'];
        let userIp;
        if (ip) {
            userIp = ip.split(',')[0];
            console.log("ippppppppp.....", userIp);
        }
        else {
            userIp = "no ip";
        }
        const packageData = yield packageModel_1.default.findOne({ _id: req.body.packageID }, { packageName: 1, review: 1 });
        {
            const adminData = yield admin_model_1.default.findOne({ email: req.body.decoded.email }, { userName: 1, picture: 1 });
            console.log("packshck", packageData);
            yield async_1.default.forEach(req.body.products, (elements, cb2) => __awaiter(this, void 0, void 0, function* () {
                const productData = yield productModels_1.default.findOne({ _id: elements }, { productNameEn: 1, image: 1 });
                const allData = new packagePermissionModel_1.default({
                    packageName: packageData.packageName,
                    packageID: packageData._id,
                    review: packageData.review,
                    productID: productData._id,
                    productNameEn: productData.productNameEn,
                    image: productData.image,
                    createdBy: {
                        name: adminData.userName,
                        image: adminData.picture,
                        ip: userIp
                    },
                });
                console.log('.....allData......', allData);
                yield allData.save();
            }));
            res.status(200).json({ success: true });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.filterPackageReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log('body in filter packg--->', req.body);
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
    if (req.body.packageName) {
        condition.packageName = new RegExp('^' + req.body.packageName, "i");
    }
    if (req.body.productNameEn) {
        condition.productNameEn = new RegExp('^' + req.body.productNameEn, "i");
    }
    if (req.body.name) {
        condition = {
            "createdBy.name": new RegExp('^' + req.body.name, "i"),
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
    try {
        console.log("filterpckgreview condition Is==>", condition);
        const reviewPckgData = yield packagePermissionModel_1.default.find(condition).sort({ createdAt: -1 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        // console.log("=======", auctionData);
        const totalCount = yield packagePermissionModel_1.default.count(condition);
        console.log("total count of reviewpackg is==>", totalCount);
        const totalPage = Math.ceil(totalCount / limitValue);
        console.log("total Page in reviewpackg filtered===>", totalPage);
        if (Object.keys(reviewPckgData).length > 0) {
            res.status(200).json({ success: "true", reviewPckgData, totalPage });
        }
        else {
            res.status(200).json({ success: false, reviewPckgData });
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
});
//# sourceMappingURL=packagePermissionController.js.map
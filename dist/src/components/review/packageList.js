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
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.jwt_secret = "jangan";
exports.filterPackage = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let page = 1, limit = 10, skip = 0;
        if (req.body.page) {
            page = req.body.page;
        }
        if (req.body.limit) {
            limit = req.body.limit;
        }
        if (page > 1) {
            skip = (page - 1) * limit;
        }
        const condition = {};
        if (req.body.review) {
            condition.review;
        }
        if (req.body.packageID) {
            condition.packageID = {
                $regex: `${req.body.packageID}`, $options: 'i'
            };
        }
        if (req.body.packageName) {
            condition.packageName = {
                $regex: `${req.body.packageName}`, $options: 'i'
            };
        }
        if (req.body.createdBy) {
            condition["createdBy.name"] = {
                $regex: `${req.body.createdBy}`, $options: 'i'
            };
        }
        if (req.body.suspend == "All") {
            condition;
        }
        if (req.body.status == "Open") {
            condition.status = req.body.status;
        }
        if (req.body.status == "Lock") {
            condition.status = req.body.status;
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
        const testReview = yield packageModel_1.default.find(condition).limit(limit).skip(skip);
        const count = yield packageModel_1.default.count(condition);
        res.status(201).json({
            totalpage: Math.ceil(count / limit),
            data: testReview
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
//# sourceMappingURL=packageList.js.map
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
const transferModel_1 = __importDefault(require("../bank/transferModel"));
const tradeoutModel_1 = __importDefault(require("../tradeExchange/tradeoutModel"));
const lodash_1 = __importDefault(require("lodash"));
exports.depositCreate = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let limit = 10;
        let page = 1;
        let skip = 0;
        if (req.query.page) {
            page = parseInt(req.query.page);
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        if (page > 1) {
            skip = (page - 1) * limit;
        }
        let transferData = [];
        if (req.body.startDate && req.body.endDate) {
            let stratSplitDate = req.body.startDate.split('-');
            let endSplitDate = req.body.endDate.split('-');
            console.log(stratSplitDate, endSplitDate);
            let startDate = new Date(stratSplitDate[2], stratSplitDate[1], stratSplitDate[0], 5, 31, 0, 0);
            let endDate = new Date(endSplitDate[2], endSplitDate[1], endSplitDate[0], 23, 59, 59, 0);
            console.log(startDate, endDate);
            transferData = yield transferModel_1.default.find({
                createdAt: {
                    '$gte': startDate,
                    '$lte': endDate
                }
            }, { email: 1, transfer: 1, withdraw: 1, amount: 1, createdAt: 1 });
        }
        else if (req.body.days) {
            let days = parseInt(req.body.days);
            let to = new Date();
            let from = new Date();
            from.setDate(from.getDate() - days);
            transferData = yield transferModel_1.default.find({
                'createdAt': {
                    '$gte': from,
                    '$lte': to
                }
            }, { email: 1, transfer: 1, withdraw: 1, amount: 1, createdAt: 1 });
        }
        else {
            transferData = yield transferModel_1.default.find({}, { email: 1, transfer: 1, withdraw: 1, amount: 1, createdAt: 1 });
        }
        let resultData = lodash_1.default.groupBy(transferData, function (el) {
            return (el.createdAt.getDate() + '/') + (el.createdAt.getMonth() + '/') + (el.createdAt.getFullYear());
        });
        let finalResult = [];
        lodash_1.default.forIn(resultData, function (value, key) {
            let transfer = 0, withdraw = 0;
            lodash_1.default.forEach(value, (element) => {
                if (element.transfer === 'Transfer') {
                    transfer += parseInt(element.amount);
                }
                else {
                    withdraw += parseInt(element.amount);
                }
            });
            finalResult = finalResult.concat({
                date: key,
                users: value.length,
                transfer: transfer,
                withdraw: withdraw,
                profit: transfer - withdraw
            });
        });
        res.status(200).json({
            "page": Math.ceil(finalResult.length / limit),
            "finalResult": lodash_1.default.reverse(finalResult).slice(skip, (skip + limit))
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.tradeDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let limit = 2;
        let page = 1;
        let skip = 0;
        if (req.query.page) {
            page = parseInt(req.query.page);
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        if (page > 1) {
            skip = (page - 1) * limit;
        }
        let transferData = [];
        if (req.body.startDate && req.body.endDate) {
            let stratSplitDate = req.body.startDate.split('-');
            let endSplitDate = req.body.endDate.split('-');
            console.log(stratSplitDate, endSplitDate);
            let startDate = new Date(stratSplitDate[2], stratSplitDate[1], stratSplitDate[0], 5, 31, 0, 0);
            let endDate = new Date(endSplitDate[2], endSplitDate[1], endSplitDate[0], 23, 59, 59, 0);
            console.log(startDate, endDate);
            transferData = yield tradeoutModel_1.default.find({
                createdAt: {
                    '$gte': startDate,
                    '$lte': endDate
                }
            }, { productName: 1, quantity: 1, retailPrice: 1, tradePrice: 1, createdAt: 1, sreviceFee: 1 });
        }
        else if (req.body.days) {
            let days = parseInt(req.body.days);
            let to = new Date();
            let from = new Date();
            from.setDate(from.getDate() - days);
            transferData = yield tradeoutModel_1.default.find({
                'createdAt': {
                    '$gte': from,
                    '$lte': to
                }
            }, { productName: 1, quantity: 1, retailPrice: 1, tradePrice: 1, createdAt: 1, sreviceFee: 1 });
        }
        else {
            transferData = yield tradeoutModel_1.default.find({}, { productName: 1, quantity: 1, retailPrice: 1, tradePrice: 1, createdAt: 1, sreviceFee: 1 });
        }
        let resultData = lodash_1.default.groupBy(transferData, function (el) {
            return (el.createdAt.getDate() + '/') + (el.createdAt.getMonth() + '/') + (el.createdAt.getFullYear());
        });
        let finalResult = [];
        let retailPrice = 0, tradePrice = 0, percentage = 0;
        lodash_1.default.forIn(resultData, function (value, key) {
            lodash_1.default.forEach(value, (element) => {
                retailPrice += parseInt(element.retailPrice);
                tradePrice += parseInt(element.tradePrice);
            });
            finalResult = finalResult.concat({
                date: key,
                products: value.length,
                retailPrice: retailPrice,
                tradePrice: tradePrice,
                percentage: parseFloat((retailPrice / tradePrice * 100).toFixed(2)),
                sreviceFee: retailPrice - tradePrice,
            });
        });
        res.status(200).json({
            "page": Math.ceil(finalResult.length / limit),
            "finalResult": lodash_1.default.reverse(finalResult).slice(skip, (skip + limit))
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
//# sourceMappingURL=depositController.js.map
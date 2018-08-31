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
const userModels_1 = __importDefault(require("../user/userModels"));
const tradeoutPaymentModel_1 = __importDefault(require("./tradeoutPaymentModel"));
const tradeStatusModel_1 = __importDefault(require("./tradeStatusModel"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.tradeStatusCreate = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        // const ip: any = req.headers['x-forwarded-for'];
        // let userIp: any;
        // if (ip) {
        //     userIp = ip.split(',')[0];
        //     console.log("ippppppppp.....", userIp);
        // } else {
        //     userIp = "no ip";
        // }
        const tradeStatusData = yield tradeoutPaymentModel_1.default.findOne({ _id: req.body._id }, { productId: 1, productName: 1, image: 1, createdAt: 1, quantity: 1, winningPrice: 1, tradePrice: 1, serviceFee: 1, sellers: 1, buyers: 1 });
        const userData = yield userModels_1.default.findOne({ _id: req.body.decoded._id }, { userName: 1, picture: 1, balance: 1 });
        console.log("tradeStatusData----->", tradeStatusData);
        // console.log("userData------>", userData);
        const allData = new tradeStatusModel_1.default({
            tradecreatedAt: tradeStatusData.tradecreatedAt,
            productId: tradeStatusData.productId,
            productName: tradeStatusData.productName,
            image: tradeStatusData.image,
            quantity: tradeStatusData.quantity,
            winningPrice: tradeStatusData.winningPrice,
            retailPrice: tradeStatusData.retailPrice,
            tradePrice: tradeStatusData.tradePrice,
            balance: tradeStatusData.balance,
            serviceFee: tradeStatusData.serviceFee,
            buyers: tradeStatusData.buyers,
            sellers: tradeStatusData.sellers
        });
        yield allData.save();
        res.status(200).json(allData);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.filterTradeStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
    if (req.body.balance) {
        condition.balance = new RegExp('^' + req.body.balance, "i");
    }
    if (req.body.productName) {
        condition.productName = new RegExp('^' + req.body.productName, "i");
    }
    if (req.body.quantity) {
        condition.quantity = new RegExp('^' + req.body.quantity, "i");
    }
    if (req.body.winningPrice) {
        condition.winningPrice = new RegExp('^' + req.body.winningPrice, "i");
    }
    if (req.body.retailPrice) {
        condition.retailPrice = new RegExp('^' + req.body.retailPrice, "i");
    }
    if (req.body.tradePrice) {
        condition.tradePrice = new RegExp('^' + req.body.tradePrice, "i");
    }
    if (req.body.serviceFee) {
        condition.serviceFee = new RegExp('^' + req.body.serviceFee, "i");
    }
    if (req.body.userName) {
        condition = {
            "sellers.userName": new RegExp('^' + req.body.userName, "i"),
        };
    }
    if (req.body.userName) {
        condition = {
            "buyers.userName": new RegExp('^' + req.body.userName, "i"),
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
    if (req.body.tradecreatedAt) {
        const searchDate = moment_timezone_1.default(req.body.tradecreatedAt).format('YYYY-MM-DD') + "T00:00:00.000";
        const searchGtDate = moment_timezone_1.default(req.body.tradecreatedAt).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
        let value = {};
        value = {
            '$lt': searchGtDate,
            '$gte': searchDate
        };
        condition.tradecreatedAt = value;
    }
    try {
        console.log("filterTradeoutPayment condition Is==>", condition);
        const tradeStatus = yield tradeStatusModel_1.default.find(condition).populate('tradeoutpaymentdetail').sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        // console.log("=======", auctionData);
        const totalCount = yield tradeoutPaymentModel_1.default.count(condition);
        console.log("total count of tradepcakage is==>", totalCount);
        const totalPage = Math.ceil(totalCount / limitValue);
        console.log("total Page in tradepcakage filtered===>", totalPage);
        if (Object.keys(tradeStatus).length > 0) {
            res.status(200).json({ success: "true", tradeStatus, totalPage });
        }
        else {
            res.status(200).json({ success: false, tradeStatus });
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
});
//# sourceMappingURL=tradeStatusController.js.map
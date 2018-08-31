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
const tradeoutModel_1 = __importDefault(require("./tradeoutModel"));
const userModels_1 = __importDefault(require("../user/userModels"));
const tradeoutPaymentModel_1 = __importDefault(require("./tradeoutPaymentModel"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.tradeoutPaymentCreate = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        const paymentTradeOut = yield tradeoutModel_1.default.findOne({ _id: req.body._id }, { productId: 1, productName: 1, image: 1, createdAt: 1, quantity: 1, winningPrice: 1, tradePrice: 1, serviceFee: 1, sellers: 1 });
        const userData = yield userModels_1.default.findOne({ _id: req.body.decoded._id }, { userName: 1, picture: 1, balance: 1 });
        console.log("paymentTradeOut----->", paymentTradeOut);
        console.log("userData------>", userData);
        const allData = new tradeoutPaymentModel_1.default({
            productId: paymentTradeOut.productId,
            productName: paymentTradeOut.productName,
            image: paymentTradeOut.image,
            tradecreatedAt: paymentTradeOut.createdAt,
            quantity: paymentTradeOut.quantity,
            winningPrice: paymentTradeOut.winningPrice,
            tradePrice: paymentTradeOut.tradePrice,
            serviceFee: paymentTradeOut.serviceFee,
            balance: userData.balance,
            sellers: paymentTradeOut.sellers,
            // sellers: {
            //     userName: userData.userName,
            //     picture: userData.picture
            // },
            buyers: {
                userName: userData.userName,
                picture: userData.picture,
                ip: userIp
            }
        });
        yield allData.save();
        res.status(200).json(allData);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
// export const tradeoutPaymentCreate = async (req: Request, res: Response) => {
//     try {
//        // const paymentTradeOut: any = await tradeoutModel.findOne({ _id: req.body._id }, { productId: 1, productName: 1, image: 1, quantity: 1, winningPrice: 1, tradePrice: 1, serviceFee: 1 });
//         const userData: any = await userModels.findOne({ _id: req.body.decoded._id }, { userName: 1, picture: 1, balance: 1 });
//        // console.log("paymentTradeOut----->", paymentTradeOut);
//         // console.log("userData------>", userData);
//         const allData: any = new tradeoutPaymentModel({
//             tradeoutpaymentdetail: req.body.tradeoutpaymentdetail,
//             buyers: {
//                 userName: userData.userName,
//                 picture: userData.picture
//             }
//         });
//         await allData.save();
//         res.status(200).json(allData);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json(error);
//     }
// };
exports.filterTradeoutPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        const paymentTradeOut = yield tradeoutPaymentModel_1.default.find(condition).populate('tradeoutpaymentdetail').sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        // console.log("=======", auctionData);
        const totalCount = yield tradeoutPaymentModel_1.default.count(condition);
        console.log("total count of tradepcakage is==>", totalCount);
        const totalPage = Math.ceil(totalCount / limitValue);
        console.log("total Page in tradepcakage filtered===>", totalPage);
        if (Object.keys(paymentTradeOut).length > 0) {
            res.status(200).json({ success: "true", paymentTradeOut, totalPage });
        }
        else {
            res.status(200).json({ success: false, paymentTradeOut });
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
});
//# sourceMappingURL=tradeoutPaymentController.js.map
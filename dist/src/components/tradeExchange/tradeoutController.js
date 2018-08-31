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
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const auctionModel_1 = __importDefault(require("../auction/auctionModel"));
const async_1 = __importDefault(require("async"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.tradeoutCreate = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const ip = req.headers["x-forwarded-for"];
        let userIp;
        if (ip) {
            userIp = ip.split(",")[0];
            console.log("ippppppppp.....", userIp);
        }
        else {
            userIp = "no ip";
        }
        const userData = yield userModels_1.default.findOne({ _id: req.body.decoded._id }, { userName: 1, picture: 1, balance: 1 });
        const auctionData = yield auctionModel_1.default.findOne({ _id: req.body._id }, {
            retailPrice: 1,
            "products.productId": 1,
            "products.productName": 1,
            "products.image": 1
        });
        console.log("auction products----->", auctionData);
        // console.log("UserData----->", userData);
        const allData = new tradeoutModel_1.default({
            balance: userData.balance,
            quantity: req.body.quantity,
            winningPrice: req.body.winningPrice,
            retailPrice: auctionData.retailPrice,
            tradePrice: req.body.tradePrice,
            serviceFee: req.body.serviceFee,
            productId: auctionData.products.productId,
            productName: auctionData.products.productName,
            image: auctionData.products.image,
            sellers: {
                userName: userData.userName,
                picture: userData.picture,
                ip: userIp
            },
            status: req.body.status
        });
        yield allData.save();
        res.status(200).json(allData);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
// export const tradeoutCreate = async (req: Request, res: Response) => {
//     try {
//         const userData: any = await userModels.findOne({ _id: req.body.decoded._id }, { userName: 1, picture: 1, balance: 1 });
//         // const auctionData: any = await Auction.findOne({ "_id": req.body.auctionData })
//         const allData: any = new tradeoutModel({
//             balance: userData.balance,
//             auctiondetail: req.body.auctiondetail,
//             quantity: req.body.quantity,
//             winningPrice: req.body.winningPrice,
//             sellers: {
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
exports.filterTradeout = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("body in filter packg--->", req.body);
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
    if (req.body.type == "tradeout") {
        console.log('tradeout');
        condition.status = "request";
    }
    else if (req.body.type == "payment") {
        condition.status = "payment";
    }
    else if (req.body.type == "tradestatus") {
        condition.status = "paid";
    }
    else {
        console.log("in else of type");
    }
    if (req.body.balance) {
        condition.balance = new RegExp("^" + req.body.balance, "i");
    }
    if (req.body.quantity) {
        condition.quantity = new RegExp("^" + req.body.quantity, "i");
    }
    if (req.body.winningPrice) {
        condition.winningPrice = new RegExp("^" + req.body.winningPrice, "i");
    }
    if (req.body.retailPrice) {
        condition.retailPrice = new RegExp("^" + req.body.retailPrice, "i");
    }
    if (req.body.tradePrice) {
        condition.tradePrice = new RegExp("^" + req.body.tradePrice, "i");
    }
    if (req.body.serviceFee) {
        condition.serviceFee = new RegExp("^" + req.body.serviceFee, "i");
    }
    if (req.body.productName) {
        condition.productName = new RegExp("^" + req.body.productName, "i");
    }
    if (req.body.sellers) {
        let userName = new RegExp("^" + req.body.sellers, "i");
        condition["sellers.userName"] = userName;
    }
    if (req.body.buyers) {
        let userName = new RegExp("^" + req.body.buyers, "i");
        condition["buyers.userName"] = userName;
    }
    console.log("sellerts------->", condition);
    if (req.body.createdAt) {
        const searchDate = moment_timezone_1.default(req.body.createdAt).format("YYYY-MM-DD") + "T00:00:00.000";
        const searchGtDate = moment_timezone_1.default(req.body.createdAt)
            .add(1, "d")
            .format("YYYY-MM-DD") + "T00:00:00.000";
        let value = {};
        value = {
            $lt: searchGtDate,
            $gte: searchDate
        };
        condition.createdAt = value;
    }
    if (req.body.updatedAt) {
        const searchDate = moment_timezone_1.default(req.body.updatedAt).format("YYYY-MM-DD") + "T00:00:00.000";
        const searchGtDate = moment_timezone_1.default(req.body.updatedAt)
            .add(1, "d")
            .format("YYYY-MM-DD") + "T00:00:00.000";
        let value = {};
        value = {
            $lt: searchGtDate,
            $gte: searchDate
        };
        condition.updatedAt = value;
    }
    try {
        console.log("filtertradeout condition Is==>", condition);
        const tradeoutData = yield tradeoutModel_1.default
            .find(condition)
            .populate("auctiondetail", "products retailPrice")
            .sort({ createdAt: -1 })
            .skip(skip_Value)
            .limit(limitValue);
        // console.log("=======", tradeoutData);
        const totalCount = yield tradeoutModel_1.default.count(condition);
        console.log("total count of tradepcakage is==>", totalCount);
        const totalPage = Math.ceil(totalCount / limitValue);
        console.log("total Page in tradepcakage filtered===>", totalPage);
        if (Object.keys(tradeoutData).length > 0) {
            res.status(200).json({ success: "true", tradeoutData, totalPage });
        }
        else {
            res.status(200).json({ success: false, tradeoutData });
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.acceptTradeOut = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let arr = [];
        async_1.default.forEach(req.body.ids, (element, cb) => __awaiter(this, void 0, void 0, function* () {
            console.log("data = ", element);
            yield tradeoutModel_1.default.findOneAndUpdate({ _id: element }, {
                $set: {
                    status: "accept"
                }
            }, { new: true }, (err, data) => {
                if (data) {
                    const _result = data.toJSON();
                    console.log("data = ", _result);
                    const obj = {
                        balance: _result.balance,
                        quantity: _result.quantity,
                        winningPrice: _result.winningPrice,
                        retailPrice: _result.retailPrice,
                        tradePrice: _result.tradePrice,
                        serviceFee: _result.serviceFee,
                        productId: _result.productId,
                        productName: _result.productName,
                        image: _result.image,
                        sellers: _result.sellers,
                        status: _result.status
                    };
                    arr.push(obj);
                    cb();
                }
                else {
                    cb();
                }
            });
        }), err => {
            res.status(200).json({ msg: "Accepted", data: arr });
        });
    }
    catch (err) {
        console.log("Error Found");
        res.status(500).json(err);
    }
});
exports.paidTradeOut = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let arr = [];
        async_1.default.forEach(req.body.ids, (element, cb) => __awaiter(this, void 0, void 0, function* () {
            console.log("data = ", element);
            yield tradeoutModel_1.default.findOneAndUpdate({ _id: element }, {
                $set: {
                    status: "paid"
                }
            }, { new: true }, (err, data) => {
                if (data) {
                    const _result = data.toJSON();
                    console.log("data = ", _result);
                    const obj = {
                        balance: _result.balance,
                        quantity: _result.quantity,
                        winningPrice: _result.winningPrice,
                        retailPrice: _result.retailPrice,
                        tradePrice: _result.tradePrice,
                        serviceFee: _result.serviceFee,
                        productId: _result.productId,
                        productName: _result.productName,
                        image: _result.image,
                        sellers: _result.sellers,
                        status: _result.status
                    };
                    arr.push(obj);
                    cb();
                }
                else {
                    cb();
                }
            });
        }), err => {
            res.status(200).json({ msg: "Accepted", data: arr });
        });
    }
    catch (err) {
        console.log("Error Found");
        res.status(500).json(err);
    }
});
exports.buyTradeOut = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const ip = req.headers["x-forwarded-for"];
        let userIp;
        if (ip) {
            userIp = ip.split(",")[0];
            console.log("ippppppppp.....", userIp);
        }
        else {
            userIp = "no ip";
        }
        let arr = [];
        async_1.default.forEach(req.body.ids, (element, cb) => __awaiter(this, void 0, void 0, function* () {
            console.log("data = ", element);
            const adminData = yield admin_model_1.default.findOne({ _id: req.body.decoded._id }, { userName: 1, picture: 1, _id: 0 });
            console.log("hello", adminData);
            yield tradeoutModel_1.default.findOneAndUpdate({ _id: element }, {
                $set: {
                    status: "payment",
                    buyers: {
                        userName: adminData.userName,
                        picture: adminData.picture,
                        ip: userIp
                    }
                }
            }, { new: true }, (err, data) => {
                if (data) {
                    const _result = data.toJSON();
                    // console.log('data = ', _result)
                    const obj = {
                        balance: _result.balance,
                        quantity: _result.quantity,
                        winningPrice: _result.winningPrice,
                        retailPrice: _result.retailPrice,
                        tradePrice: _result.tradePrice,
                        serviceFee: _result.serviceFee,
                        productId: _result.productId,
                        productName: _result.productName,
                        image: _result.image,
                        sellers: _result.sellers,
                        status: _result.status,
                        buyers: _result.buyers
                    };
                    arr.push(obj);
                    cb();
                }
                else {
                    cb();
                }
            });
        }), err => {
            res.status(200).json({ msg: "Accepted", data: arr });
        });
    }
    catch (err) {
        console.log("Error Found");
        res.status(500).json(err);
    }
});
//# sourceMappingURL=tradeoutController.js.map
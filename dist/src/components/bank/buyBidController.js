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
const transferModel_1 = __importDefault(require("./transferModel"));
const userModels_1 = __importDefault(require("../user/userModels"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const bankModels_1 = __importDefault(require("./bankModels"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const en_1 = __importDefault(require("../../../language/en"));
const my_1 = __importDefault(require("../../../language/my"));
const mongoose_1 = __importDefault(require("mongoose"));
const bidModels_1 = __importDefault(require("./bidModels"));
const types_1 = require("../../socket/types");
const notifyControllers_1 = require("../notification/notifyControllers");
const deviceModel_1 = __importDefault(require("../notification/deviceModel"));
exports.createbuybank = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const ip = req.headers['x-forwarded-for'];
        const userIp = ip.split(",")[0];
        const userData = yield userModels_1.default.findOne({ email: req.body.decoded.email }, { userName: 1, loginType: 1, picture: 1, lang: 1, _id: 1, suspend: 1 });
        const bankData = yield bankModels_1.default.findOne({ _id: req.body.bankId }, { bankName: 1, picture: 1, bankShortName: 1 });
        const bidData = yield bidModels_1.default.findOne({ _id: req.body.bidId }, { amount: 1, bidPackageName: 1, noOfBids: 1 });
        if (userData) {
            const buybid = new transferModel_1.default({
                userId: userData._id,
                email: req.body.decoded.email,
                suspend: userData.suspend,
                name: {
                    userName: userData.userName,
                    img: userData.picture,
                    ip: userIp,
                },
                loginType: userData.loginType,
                transferBy: "Bank",
                transfer: "",
                bidPackageName: bidData.bidPackageName,
                amount: bidData.noOfBids,
                totalAmt: bidData.amount,
                bankName: bankData.bankShortName,
                picture: bankData.picture,
                invoice: req.body.invoice,
                action: req.body.action,
                lang: req.body.lang,
            });
            yield buybid.save();
            res.status(200).json({
                msg: userData.lang == "en" ? en_1.default.bids : my_1.default.bids
            });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.action = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const ip = req.headers['x-forwarded-for'];
        const userIp = ip.split(',')[0];
        if (req.body.actionType == "Transfer") {
            const noOfBid = yield transferModel_1.default.findOne((mongoose_1.default.Types.ObjectId(req.body.buyID)), { amount: 1, email: 1 });
            const bidTransfer = parseInt(noOfBid.amount);
            const userBalance = yield userModels_1.default.findOne({ email: noOfBid.email }, { balance: 1, userName: 1 });
            const balance = parseInt(userBalance.balance);
            const totalBalance = balance + parseInt(bidTransfer);
            const updateBalance = yield userModels_1.default.findOneAndUpdate({ email: noOfBid.email }, { $set: { "balance": totalBalance } }, { new: true });
            const adminData = yield admin_model_1.default.findOne({ email: req.body.decoded.email }, { password: 0 });
            const createdBy = {
                userName: adminData.userName,
                picture: adminData.picture,
                ip: userIp,
            };
            const actionData = yield transferModel_1.default.findByIdAndUpdate(mongoose_1.default.Types.ObjectId(req.body.buyID), { $set: { action: req.body.actionType, balance: updateBalance.balance, createdBy: createdBy, is_Active: true, transferBy: "Bank", transfer: "Transfer", transferAction: true } }, { new: true });
            deviceModel_1.default.findOne({ userId: req.body.userId }, (err, notify) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    throw err;
                else {
                    let info = {};
                    let obj = {
                        title: 'new-transition',
                        notificationType: types_1.Types.CREATE_TRANSFER,
                        // type: Types.CREATE_TRANSFER,
                        content: { balance: totalBalance },
                        data: {
                            amount: totalBalance,
                            type: types_1.Types.CREATE_TRANSFER,
                        }
                    };
                    notifyControllers_1.sendNotification(obj, info, notify.token, (err, data) => __awaiter(this, void 0, void 0, function* () {
                    }));
                }
            }));
            // let respondToUser = await onlineUser.filter((user: any) => user.userId == req.body.userId);
            // if (respondToUser.length > 0) {
            //     async.forEach(respondToUser, (userSession: any) => {
            //         userSession.ws.send(JSON.stringify({ 'type': Types.CREATE_TRANSFER, 'amount': noOfBid.amount }));
            //     });
            // }
            res.status(200).send({ actionData, updateBalance });
        }
        else if (req.body.actionType == "Reject") {
            const actionData = yield transferModel_1.default.findByIdAndUpdate(mongoose_1.default.Types.ObjectId(req.body.buyID), { $set: { action: req.body.actionType, is_Active: true, reject: true, transferBy: "Bank" } }, { new: true });
            res.status(200).json(actionData);
        }
        else {
            res.status(400).json("Not Found");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.filterBuyBid = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
    condition.is_Active = false;
    condition.transferBy = "Bank";
    if (req.body.userName) {
        condition["name.userName"] = {
            $regex: `${req.body.userName}`, $options: 'i'
        };
    }
    if (req.body.email) {
        condition.email = new RegExp('^' + req.body.email, "i");
    }
    if (req.body.loginType) {
        condition.loginType = new RegExp('^' + req.body.loginType, "i");
    }
    if (req.body.bidPackageName) {
        condition.bidPackageName = new RegExp('^' + req.body.bidPackageName, "i");
    }
    if (req.body.noOfBids) {
        condition.amount = new RegExp('^' + req.body.noOfBids, "i");
    }
    if (req.body.bankName) {
        condition.bankName = new RegExp('^' + req.body.bankName, "i");
    }
    if (req.body.invoice) {
        condition.invoice = new RegExp('^' + req.body.invoice, "i");
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
        const buyBidList = yield transferModel_1.default.find(condition).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
        const totalCount = yield transferModel_1.default.count(condition);
        const totalPage = Math.ceil(totalCount / limitValue);
        res.status(200).json({ buyBidList, totalPage });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
//# sourceMappingURL=buyBidController.js.map
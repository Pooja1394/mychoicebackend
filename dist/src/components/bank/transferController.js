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
const transferModel_1 = __importDefault(require("./transferModel"));
const userModels_1 = __importDefault(require("../user/userModels"));
const settingModel_1 = __importDefault(require("../settings/settingModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const async = __importStar(require("async"));
const types_1 = require("../../socket/types");
const notifyControllers_1 = require("../notification/notifyControllers");
const deviceModel_1 = __importDefault(require("../notification/deviceModel"));
exports.createTransfer = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield async.forEach(req.body.userId, (element, cb) => __awaiter(this, void 0, void 0, function* () {
            const ip = req.headers['x-forwarded-for'];
            const userIp = ip.split(",")[0];
            const userData = yield userModels_1.default.findOne({ _id: element._id }, { email: 1, userName: 1, loginType: 1, balance: 1, picture: 1 });
            const num1 = parseInt(userData.balance);
            const num2 = parseInt(element.amount);
            let total = num1 + num2;
            const transferNum = num1;
            const withdrawNum = total;
            yield userModels_1.default.findOne({ _id: element._id }, function (err, data) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        throw err;
                    else {
                        if (data && total < 1) {
                            data.balance = 0;
                            total = 0;
                            yield data.save();
                        }
                        else if (data) {
                            data.balance = total;
                            yield data.save();
                        }
                        else {
                            console.log("Balance data not found");
                        }
                    }
                });
            });
            let message = '';
            let bal = 0;
            if (withdrawNum > transferNum) {
                message = 'Transfer';
            }
            else {
                message = 'Withdraw';
            }
            if (element.amount < 0 && element.amount * -1 > userData.balance) {
                bal = userData.balance;
            }
            else {
                bal = Math.abs(element.amount);
            }
            if (userData) {
                const adminData = yield admin_model_1.default.findById(mongoose_1.default.Types.ObjectId(req.body.decoded._id));
                const settingData = yield settingModel_1.default.findById(mongoose_1.default.Types.ObjectId(req.body._id));
                const transferData = new transferModel_1.default({
                    userID: element._id,
                    email: userData.email,
                    userName: userData.userName,
                    transferAction: true,
                    loginType: userData.loginType,
                    balance: total,
                    name: {
                        userName: userData.userName,
                        img: userData.picture,
                        ip: userIp
                    },
                    createdBy: {
                        userName: adminData.userName,
                        picture: adminData.picture,
                        ip: userIp
                    },
                    amount: bal,
                    totalAmt: bal * settingData.bidSellingPrice,
                    transferBy: 'Manual',
                    transfer: message,
                });
                yield transferData.save();
                deviceModel_1.default.findOne({ userId: userData._id }, (err, notify) => __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        throw err;
                    else {
                        let info = {};
                        let obj = {
                            title: 'new-transition',
                            notificationType: types_1.Types.CREATE_TRANSFER,
                            content: { balance: total },
                            data: {
                                amount: total,
                                type: types_1.Types.CREATE_TRANSFER,
                            }
                        };
                        notifyControllers_1.sendNotification(obj, info, notify.token, (err, data) => __awaiter(this, void 0, void 0, function* () {
                        }));
                    }
                }));
                // let respondToUser = await onlineUser.filter((user: any) => user.userId == userData._id);
                // console.log("respondToUser-------->", respondToUser, respondToUser.length > 0);
                // if (respondToUser.length > 0) {
                //     async.forEach(respondToUser, (userSession: any) => {
                //         userSession.ws.send(JSON.stringify({ 'type': Types.CREATE_TRANSFER, 'amount': total }));
                //     });
                // }
            }
        }));
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json(error);
    }
});
exports.filterTransferApi = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        if (true) {
            condition.transferAction = true;
            if (req.body.email) {
                condition.email = {
                    $regex: `${req.body.email}`, $options: 'i'
                };
            }
            if (req.body.loginType) {
                condition.loginType = {
                    $regex: `${req.body.loginType}`, $options: 'i'
                };
            }
            if (req.body.userName) {
                condition["name.userName"] = {
                    $regex: `${req.body.userName}`, $options: 'i'
                };
            }
            if (req.body.balance) {
                condition.balance = {
                    $regex: `${req.body.balance}`, $options: 'i'
                };
            }
            if (req.body.transfer) {
                condition.transfer = {
                    $regex: `${req.body.transfer}`, $options: 'i'
                };
            }
            if (req.body.amount) {
                condition.amount = {
                    $regex: `${req.body.amount}`, $options: 'i'
                };
            }
            if (req.body.createdBy) {
                condition["createdBy.userName"] = {
                    $regex: `${req.body.createdBy}`, $options: 'i'
                };
            }
            if (req.body.updatedAt) {
                const searchDate = moment_timezone_1.default(req.body.updatedAt).format('YYYY-MM-DD') + "T00:00:00.000";
                const searchGtDate = moment_timezone_1.default(req.body.updatedAt).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
                let value = {};
                value = {
                    '$lt': searchGtDate,
                    '$gte': searchDate
                };
                condition.updatedAt = value;
            }
            if (req.body.name) {
                condition["name.userName"] = {
                    $regex: `${req.body.name}`, $options: 'i'
                };
            }
        }
        yield transferModel_1.default.find(condition, { __v: 0 }, (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (data) {
                const count = yield transferModel_1.default.count(condition);
                const totalPages = Math.ceil(count / limitValue);
                res.status(200).json({ data, totalPages });
            }
            else {
                res.status(400).json("Cannot find data");
            }
        })).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.transferAndWithdraw = (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield transferModel_1.default.find({ email: req.body.decoded.email }, { balance: 1 });
    const num1 = parseInt(req.body.balance);
    const num2 = parseInt(req.body.amount);
    const total = num1 + num2;
    yield transferModel_1.default.findOne({ email: req.body.decoded.email }, function (err, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err)
                throw err;
            else {
                if (data.balance > num1) {
                    res.status(200).json({ msg: 'Balance is transfer' });
                }
                else {
                    res.status(200).json({ msg: 'Balance is withdraw' });
                }
            }
        });
    });
});
//# sourceMappingURL=transferController.js.map
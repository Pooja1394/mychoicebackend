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
const logModel_1 = __importDefault(require("./logModel"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.logsCreate = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        const userData = yield userModels_1.default.findOne({ _id: req.body._id }, {
            userName: 1,
            picture: 1,
            createdBy: 1,
            email: 1,
            _id: 1
        });
        console.log("userData----->", userData);
        const logData = new logModel_1.default({
            userId: userData._id,
            users: {
                userName: userData.userName,
                picture: userData.picture,
                ip: userIp
            },
            email: userData.email,
            ip: userIp,
            userType: userData.createdBy,
            objectType: req.body.objectType,
            activities: req.body.activities
        });
        console.log("log DAta----->", logData);
        yield logData.save();
        res.status(200).json(logData);
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});
exports.filterLogs = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
    if (req.body.userName) {
        condition = {
            "users.userName": new RegExp('^' + req.body.userName, "i"),
        };
    }
    if (req.body.email) {
        condition.email = new RegExp("^" + req.body.email, "i");
    }
    if (req.body.userType) {
        condition.userType = new RegExp("^" + req.body.userType, "i");
    }
    if (req.body.objectType) {
        condition.objectType = new RegExp("^" + req.body.objectType, "i");
    }
    if (req.body.activities) {
        condition.activities = new RegExp("^" + req.body.activities, "i");
    }
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
    try {
        const logModelData = yield logModel_1.default
            .find(condition)
            .populate("auctiondetail", "products retailPrice")
            .sort({ createdAt: -1 })
            .skip(skip_Value)
            .limit(limitValue);
        const totalCount = yield logModel_1.default.count(condition);
        const totalPage = Math.ceil(totalCount / limitValue);
        if (Object.keys(logModelData).length > 0) {
            res.status(200).json({ success: "true", logModelData, totalPage });
        }
        else {
            res.status(200).json({ success: false, logModelData });
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getUserData = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield userModels_1.default.find({}, { __v: 0 }, (err, data) => {
            console.log(`user:----`, err, data);
            if (data) {
                res.json(data);
            }
            else if (err) {
                res.status(500).json({ err: err });
            }
        });
    }
    catch (error) {
        console.log("Error Found");
        res.status(400).json(error);
    }
});
//# sourceMappingURL=logController.js.map
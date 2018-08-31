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
const settingModel_1 = __importDefault(require("./settingModel"));
exports.settings = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const obj = req.body;
    const setting = new settingModel_1.default(obj);
    setting.save((err, data) => {
        if (err) {
            res.status(400).json({
                msg: "Error"
            });
        }
        else {
            res.status(200).json({ msg: "Successfull" });
        }
    });
});
exports.getSetting = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield settingModel_1.default.find({}, { _id: 0, __v: 0 }, (err, data) => {
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
exports.updateSetting = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("userName = ", req.body.userName);
    try {
        yield settingModel_1.default.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                bidExchange: req.body.bidExchange,
                bidSellingPrice: req.body.bidSellingPrice,
                timeIncrement: req.body.timeIncrement,
                priceIncrement: req.body.priceIncrement
            }
        }, { new: true }, (err, data) => {
            console.log(`user:----`, data);
            if (data) {
                const _result = data.toJSON();
                const obj = {
                    bidExchange: _result.bidExchange,
                    bidSellingPrice: _result.bidSellingPrice,
                    msg: "Updated"
                };
                res.json(obj);
            }
            else {
                res.status(400).json({ msg: "No Data Found" });
            }
        });
    }
    catch (error) {
        console.log("Error Found");
        res.status(400).json(error);
    }
});
//# sourceMappingURL=SettingController.js.map
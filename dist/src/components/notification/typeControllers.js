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
const express_1 = __importDefault(require("express"));
const typeModel_1 = __importDefault(require("./typeModel"));
exports.jwt_secret = "ADIOS AMIGOS";
const app = express_1.default();
const xlsxtojson = require("xls-to-json");
exports.insertTypeData = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const obj = req.body;
    const types = new typeModel_1.default(obj);
    types.save((err, data) => {
        if (err) {
            res.status(400).json({
                msg: "Error while Inserting Data"
            });
        }
        else {
            res.status(200).json({ msg: "Successfully Inserted Data" });
        }
    });
});
exports.getTypeData = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield typeModel_1.default.find({}, { _id: 0, __v: 0 }, (err, data) => {
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
//# sourceMappingURL=typeControllers.js.map
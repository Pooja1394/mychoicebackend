"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const settingSchema = new Schema({
    bidExchange: {
        type: String
    },
    bidSellingPrice: {
        type: String
    },
    timeIncrement: {
        type: String
    },
    priceIncrement: {
        type: String
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('setting', settingSchema);
//# sourceMappingURL=settingModel.js.map
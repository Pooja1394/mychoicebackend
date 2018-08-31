"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const depositReportsSchema = new mongoose_1.default.Schema({
    from: {
        type: Date
    },
    to: {
        type: Date
    },
    numberofUsers: {
        type: String
    },
    transfer: {
        type: String
    },
    withdraw: {
        type: String
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('depositreports', depositReportsSchema);
//# sourceMappingURL=depositModel.js.map
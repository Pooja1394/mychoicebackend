"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const device = new mongoose_1.default.Schema({
    deviceId: String,
    platform: String,
    token: String,
    userId: String
}, { timestamps: true });
exports.default = mongoose_1.default.model('Devices', device);
//# sourceMappingURL=deviceModel.js.map
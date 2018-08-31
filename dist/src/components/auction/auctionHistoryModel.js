"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const auctionHistorySchema = new mongoose_1.default.Schema({
    auctionId: {
        type: String,
    },
    userId: {
        type: String,
    },
    amount: {
        type: String,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('AuctionHistory', auctionHistorySchema);
//# sourceMappingURL=auctionHistoryModel.js.map
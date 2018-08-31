"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userFeedbackSchema = new mongoose_1.default.Schema({
    userId: {
        type: String
    },
    reviewId: {
        type: String
    },
    isLike: {
        type: Boolean
    },
    isDislike: {
        type: Boolean
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('userFeedback', userFeedbackSchema);
//# sourceMappingURL=likeModel.js.map
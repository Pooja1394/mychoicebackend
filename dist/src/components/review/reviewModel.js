"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    name: { type: String },
    rating: { type: String, default: 0 }
});
exports.default = mongoose_1.default.model('review', reviewSchema);
//# sourceMappingURL=reviewModel.js.map
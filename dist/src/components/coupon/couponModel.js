"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const coupon = new mongoose_1.default.Schema({
    code: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    sendingDate: {
        type: String,
    },
    packageId: {
        type: String,
        required: true,
    },
    sales: {
        type: Date,
    },
    usedDate: {
        type: Date,
    },
    packageType: {
        type: String,
    },
    promoted: {
        type: Date,
    },
    amount: {
        type: String,
        required: true,
    },
    createdBy: {
        name: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        }
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('coupon', coupon);
//# sourceMappingURL=couponModel.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const couponPackage = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    balance: {
        type: Boolean,
        required: true,
        default: true,
    },
    supplierId: {
        type: String,
        required: true,
    },
    brandId: {
        type: String,
    },
    productId: {
        type: String,
    },
    packageType: {
        type: String,
        required: true,
    },
    packageAmount: {
        type: String,
        required: true,
    },
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    noOfCode: {
        type: String,
        required: true,
    },
    status: {
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
exports.default = mongoose_1.default.model('couponPackage', couponPackage);
//# sourceMappingURL=couponPackageModel.js.map
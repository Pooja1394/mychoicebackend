"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    productId: {
        type: String
    },
    productName: {
        type: String
    },
    image: {},
    quantity: {
        type: String,
        default: 1
    },
    status: {
        type: String,
        default: ""
    },
    orderType: {
        type: String
    },
    retailPrice: {
        type: String
    },
    shippingCharge: {
        type: String,
    },
    promotion: {
        type: String
    },
    coupon: {
        type: String
    },
    user: {
        userName: {
            type: String
        },
        picture: {
            type: String
        },
        ip: {
            type: String
        }
    },
    totalPrice: {
        type: String
    },
    products: {},
}, { timestamps: true });
exports.default = mongoose_1.default.model("orderschema", orderSchema);
//# sourceMappingURL=orderModel.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tradeStatusSchema = new mongoose_1.default.Schema({
    tradecreatedAt: {
        type: Date
    },
    productId: {
        type: String
    },
    productName: {
        type: String,
    },
    image: {},
    quantity: {
        type: String,
        default: 1
    },
    winningPrice: {
        type: String,
        default: 5000
    },
    retailPrice: {
        type: String,
        default: 25000
    },
    tradePrice: {
        type: String,
        default: 5000
    },
    balance: {
        type: String
    },
    serviceFee: {
        type: String,
        default: 500
    },
    sellers: {
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
    buyers: {
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
    tradeoutpaymentdetail: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'tradeoutSchema'
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('tradeStatus', tradeStatusSchema);
//# sourceMappingURL=tradeStatusModel.js.map
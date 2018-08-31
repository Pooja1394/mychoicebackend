"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const transferSchema = new Schema({
    name: {
        userName: {
            type: String,
        },
        img: {
            type: String,
        },
        ip: {
            type: String,
            default: "",
        }
    },
    email: {
        type: String
    },
    suspend: {
        type: Boolean
    },
    loginType: {
        type: String
    },
    balance: {
        type: Number
    },
    amount: {
        type: String
    },
    title: {
        type: String
    },
    notificationType: {
        type: String
    },
    action: {
        type: String
    },
    transfer: {
        type: String
    },
    transferAction: {
        type: Boolean,
        default: false
    },
    withdraw: {
        type: String
    },
    transferBy: {
        type: String,
        default: "",
    },
    createdBy: {
        userName: {
            type: String,
            default: "Admin"
        }, picture: {
            type: String,
            default: ""
        }, ip: {
            type: String,
            default: ""
        }
    },
    userId: {
        type: String,
    },
    totalAmt: {
        type: String
    },
    lang: {
        type: String,
        default: "en"
    },
    bidPackageName: {
        type: String,
    },
    noOfBids: {
        type: String,
    },
    picture: {
        type: String,
    },
    bankName: {
        type: String,
    },
    invoice: {
        type: String,
    },
    reject: {
        type: Boolean,
        default: false,
    },
    transferBuy: {
        type: String,
        default: "",
    },
    is_Active: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('transfer', transferSchema);
//# sourceMappingURL=transferModel.js.map
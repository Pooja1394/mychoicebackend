"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const notification = new Schema({
    title: {
        type: String,
    },
    notificationType: {
        type: Array,
    },
    content: {
        type: String,
    },
    action: {
        type: String
    },
    checkAll: {
        type: String,
        default: false
    },
    notification: String,
    isRead: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    notificationTypeId: {
        type: mongoose_1.default.Schema.Types.ObjectId
    },
    userId: {
        type: String
    },
    sender: {
        name: {
            type: String,
            default: "Admin"
        }, img: {
            type: String,
            default: ""
        }, ip: {
            type: String,
            default: ""
        }
    },
    time: String
}, { timestamps: true });
exports.default = mongoose_1.default.model('notification', notification);
//# sourceMappingURL=notifyModels.js.map
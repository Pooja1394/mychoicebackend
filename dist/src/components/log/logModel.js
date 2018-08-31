"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logSchema = new mongoose_1.default.Schema({
    userId: {
        type: String
    },
    users: {
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
    email: {
        type: String
    },
    ip: {
        type: String
    },
    userType: {
        type: String
    },
    objectType: {
        type: String
    },
    activities: {
        type: String
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("log", logSchema);
//# sourceMappingURL=logModel.js.map
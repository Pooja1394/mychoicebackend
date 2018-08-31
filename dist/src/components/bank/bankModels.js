"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const bankSchema = new Schema({
    bankName: {
        type: String,
    },
    bankShortName: {
        type: String,
    },
    picture: {
        type: String,
    },
    createdBy: {
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
    bankId: {
        type: String,
        require: true,
        default: ""
    },
    status: {
        type: Boolean,
        default: "false"
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Bank', bankSchema);
//# sourceMappingURL=bankModels.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const bidSchema = new Schema({
    bidPackageName: {
        type: String,
    },
    noOfBids: {
        type: String,
    },
    amount: {
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
    packageId: {
        type: String,
        require: true,
        default: ""
    },
    status: {
        type: Boolean,
        default: "false"
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('bidpackage', bidSchema);
//# sourceMappingURL=bidModels.js.map
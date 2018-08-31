"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const permission = new mongoose_1.default.Schema({
    packageId: {
        type: String,
        required: true,
    },
    permissionTo: [],
    type: {
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
exports.default = mongoose_1.default.model('permission', permission);
//# sourceMappingURL=permissionModel.js.map
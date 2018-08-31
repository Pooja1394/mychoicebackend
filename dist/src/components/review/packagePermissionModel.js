"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const permissionReview = new mongoose_1.default.Schema({
    packageID: String,
    packageName: String,
    review: [],
    productID: {
        type: String
    },
    productNameEn: {
        type: String
    },
    image: Array,
    createdBy: {
        name: {
            type: String,
        },
        ip: {
            type: String,
        },
        image: {
            type: String,
        }
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('permissionReview', permissionReview);
//# sourceMappingURL=packagePermissionModel.js.map
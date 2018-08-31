"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewManagementSchema = new mongoose_1.default.Schema({
    productID: {
        type: String
    },
    productNameEn: {
        type: String,
    },
    image: [],
    reviewedBy: {
        name: {
            type: String,
        },
        image: {
            type: String,
        },
        ip: {
            type: String,
        },
    },
    deliverPerson: {
        name: {
            type: String,
        },
        image: {
            type: String,
        },
        ip: {
            type: String,
        },
    },
    createdBy: {
        userName: {
            type: String,
        },
        image: {
            type: String,
        },
        ip: {
            type: String,
        },
    },
    points: {
        type: String,
        default: 100,
    },
    review: [],
    message: {
        type: String,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('reviewmanagement', reviewManagementSchema);
//# sourceMappingURL=reviewManagmentModel.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const supplierSchema = new mongoose_1.default.Schema({
    supplierID: {
        type: String,
        require: true,
        default: ""
    },
    supplierNameEn: {
        type: String,
        require: true
    },
    supplierNameMn: {
        type: String,
        require: true
    },
    authPerson: {
        type: String,
        require: true
    },
    designation: {
        type: String,
        require: true
    },
    address: {
        type: String
    },
    town: {
        type: String
    },
    state: {
        type: String
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
    phoneNum1: {
        type: String
    },
    phoneNum2: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    infoFile: {
        type: Array
    },
    brand: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Supplier', supplierSchema);
//# sourceMappingURL=supplierModels.js.map
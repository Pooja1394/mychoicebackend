"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
    },
    bidSellingPrice: {
        type: String
    },
    password: {
        type: String,
    },
    userName: {
        type: String,
        default: 'Admin',
    },
    picture: {
        type: String,
    },
    EmployeeId: {
        type: String
    },
    EmployeeName: {
        type: String
    },
    Designation: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Designation'
    },
    Department: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Department'
    },
    Privileges: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'privilege'
    },
    status: {
        type: Boolean,
        // required: true,
        default: false
    },
    Address: {
        type: String
    },
    TownShip: {
        type: String
    },
    DivisionORstate: {
        type: String
    },
    phoneNo1: {
        type: String
    },
    phoneNo2: {
        type: String
    },
    img: {
        type: String
    },
    lastlogin: {
        type: String
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Admin', adminSchema);
//# sourceMappingURL=admin.model.js.map
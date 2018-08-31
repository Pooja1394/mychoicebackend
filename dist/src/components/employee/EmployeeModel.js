"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const EmployeeSchema = new mongoose_1.default.Schema({
    EmployeeId: {
        type: String
    },
    qrcode: {
        type: String
    },
    img1: {
        type: String
    },
    qrId: {
        type: String
    },
    EmployeeName: {
        type: String
    },
    employeetype: {
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
    email: {
        type: String
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Admin'
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
exports.default = mongoose_1.default.model('employee', EmployeeSchema);
//# sourceMappingURL=EmployeeModel.js.map
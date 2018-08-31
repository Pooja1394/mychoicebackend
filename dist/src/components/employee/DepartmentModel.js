"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DepartmentSchema = new mongoose_1.default.Schema({
    DepartmentId: {
        type: String
    },
    DepartmentName: {
        type: String
    },
    Description: {
        type: String
    },
    Designation: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Designation'
        }
    ],
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Department', DepartmentSchema);
//# sourceMappingURL=DepartmentModel.js.map
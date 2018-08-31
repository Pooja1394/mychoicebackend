"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DesignationSchema = new mongoose_1.default.Schema({
    DesignationId: {
        type: String
    },
    DesignationName: {
        type: String
    },
    Description: {
        type: String
    },
    privilege: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'privilege'
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
exports.default = mongoose_1.default.model('Designation', DesignationSchema);
//# sourceMappingURL=DesignationModel.js.map
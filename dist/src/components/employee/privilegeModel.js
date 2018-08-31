"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const privilegeSchema = new mongoose_1.default.Schema({
    PrivilegeId: {
        type: String
    },
    privilegeName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    privilege: [{
            selectPrivilege: {
                type: String,
                required: true,
                _id: false
            },
            view: {
                type: Boolean,
                default: false
            },
            add: {
                type: Boolean,
                default: false
            },
            update: {
                type: Boolean,
                default: false
            },
            delete: {
                type: Boolean,
                default: false
            },
        }],
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('privilege', privilegeSchema);
//# sourceMappingURL=privilegeModel.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const packageSchema = new mongoose_1.default.Schema({
    packageID: {
        type: String,
        require: true,
        default: ""
    },
    packageName: {
        type: String
    },
    review: [{
            name: { type: String },
            rating: { type: String }
        }],
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
    status: {
        type: String,
        default: "Open"
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('packages', packageSchema);
//# sourceMappingURL=packageModel.js.map
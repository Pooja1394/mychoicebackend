"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cateSchema = new mongoose_1.default.Schema({
    categoryID: {
        type: String,
        require: true,
        default: ""
    },
    cateNameEn: {
        type: String,
        require: true
    },
    cateNameMn: {
        type: String,
        require: true
    },
    descriptionEn: {
        type: String,
        require: true
    },
    descriptionMn: {
        type: String,
        require: true
    },
    brandId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        require: true
    },
    brandName: [],
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
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    brand: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Category', cateSchema);
//# sourceMappingURL=categoryModels.js.map
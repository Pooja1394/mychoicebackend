"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BrandSchema = new mongoose_1.default.Schema({
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
    brandName: {
        type: String,
        require: true
    },
    createdBy: {
        type: String,
        default: "Self"
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
exports.default = mongoose_1.default.model('Brands', BrandSchema);
//# sourceMappingURL=catagoryModels.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ProductSchema = new Schema({
    productID: {
        type: String,
        require: true,
        default: ""
    },
    productNameEn: {
        type: String,
        require: true
    },
    productNameMn: {
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
    video: {
        type: String,
        require: true
    },
    footerDescEn: {
        type: String,
        require: true
    },
    footerDescMn: {
        type: String,
        require: true
    },
    quantity: {
        type: String,
        require: true
    },
    productTag: {
        type: String,
        require: true
    },
    retailPrice: {
        type: String,
        require: true
    },
    profit: {
        type: String,
        require: true
    },
    supplierName: {
        id: mongoose_1.default.Schema.Types.ObjectId,
        name: String
    },
    category: [],
    categoryList: {
        type: String,
        require: true
    },
    brand: {
        id: mongoose_1.default.Schema.Types.ObjectId,
        name: String
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
    status: {
        type: Boolean,
        default: false
    },
    image: {
        type: Array
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Product', ProductSchema);
//# sourceMappingURL=productModels.js.map
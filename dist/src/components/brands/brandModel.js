"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BrandSchema = new mongoose_1.default.Schema({
    brandID: {
        type: String,
        require: true,
        default: ""
    },
    brandNameEn: {
        type: String,
        require: true
    },
    brandNameMn: {
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
    supplierName: [{
            _id: 0,
            name: {
                type: String
            },
            id: {
                type: String
            },
        }],
    supplierList: {
        type: String,
        require: true
    },
    authPerson: {
        type: String
    },
    designation: {
        type: String
    },
    address: {
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
    product: {
        type: Number,
        default: 0,
    },
    supplier: {
        type: Number,
        default: 0
    },
    town: {
        type: String
    },
    state: {
        type: String
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Brands', BrandSchema);
//# sourceMappingURL=brandModel.js.map
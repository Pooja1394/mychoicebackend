"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const serviceSchema = new Schema({
    carrierName: {
        type: String
    },
    shippingDate: {
        type: String
    },
    deliveryFee: {
        type: String
    },
    offAddress: {
        type: String
    },
    status: {
        type: String,
        default: false
    },
    _state: {
        type: String,
    },
    township: {
        type: Array,
        _id: false
    },
    division: {
        type: String
    },
    townShip: {
        type: String
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('deliveryservice', serviceSchema);
//# sourceMappingURL=serviceModel.js.map
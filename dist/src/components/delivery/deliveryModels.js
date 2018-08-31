"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const deliverySchema = new Schema({
    _state: {
        type: String,
    },
    city: {
        type: String
    },
    township: {
        type: Array,
        _id: false
    },
    carrierName: {
        type: String
    },
});
exports.default = mongoose_1.default.model('Delivery', deliverySchema);
//# sourceMappingURL=deliveryModels.js.map
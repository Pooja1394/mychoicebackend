"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    lang: {
        type: String,
        default: "en"
    },
    picture: {
        type: String,
    },
    lastLogin: {
        type: String,
    },
    userName: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        // required: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
    },
    level: {
        type: String,
        default: "Beginner"
    },
    loginType: {
        type: String,
        default: "Manual"
    },
    suspend: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: String,
        default: "Self"
    },
    bio: {
        type: String,
        maxlength: 100,
        default: ""
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    ipAddress: {
        type: String,
    },
    success: {
        type: Boolean
    },
    // address:
    // {
    //         localadd: String,
    //         state: String,
    //         city: String,
    //         townShip: String
    //       },
    localadd: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    township: {
        type: String,
    },
    newPassword: {
        type: String,
    },
    balance: {
        type: Number,
        default: 0
    },
    is_Facebook: {
        type: Boolean
    },
    is_reset: {
        type: Boolean,
        default: false
    },
    amount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=userModels.js.map
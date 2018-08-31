"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_controller_1 = require("../admin/admin.controller");
const constant_1 = __importDefault(require("../config/constant"));
exports.varifyToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    console.log("you are in ....varifyToken", req.headers.authorization);
    const tkn = req.headers.authorization;
    let token = "";
    if (tkn != "" && tkn != undefined) {
        const data = tkn.split('Bearer');
        const encrypt = data[1];
        // console.log("you are in verify Token encrypt", encrypt);
        if (encrypt)
            token = encrypt.trim();
        if (token) {
            try {
                // console.log("token is===>", token);
                const result = yield jsonwebtoken_1.default.decode(token);
                if (result) {
                    req.body.decoded = result;
                    console.log("result token is:", req.body.decoded, req.body.decoded._id);
                    next();
                }
                else {
                    return res.status(403).json({ msg: "Invalid token" });
                }
            }
            catch (error) {
                res.status(500).json(error);
            }
        }
        else {
            return res.status(403).json({ msg: "Token not valid" });
        }
    }
    else {
        return res.status(403).json({ msg: "Token not provided" });
    }
});
exports.checkExpiry = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        // console.log("token under checkexpiry", token);
        if (token != '' && token != undefined) {
            const decoded = yield jsonwebtoken_1.default.decode(token);
            console.log('decoded token is===>', decoded);
            const refreshToken = jsonwebtoken_1.default.sign({ decoded }, admin_controller_1.jwt_secret, {
                algorithm: 'HS384',
                expiresIn: constant_1.default.expiresIn,
                issuer: 'Vivek'
            });
            res.status(200).json({
                refreshToken,
                expiresIn: constant_1.default.expiresIn - 86400,
                msg: 'token refreshed',
            });
        }
        else {
            res.status(403).json('Token not Provided');
        }
    }
    catch (err) {
        res.status(400).json({ msg: err });
    }
});
//# sourceMappingURL=permission.js.map
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
const userControllers_1 = require("../user/userControllers");
exports.verifyToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    console.log("req.headers.authorization ::", req.headers.authorization);
    const tkn = req.headers.authorization;
    if (tkn) {
        const dt1 = tkn.split('Bearer');
        const encrypt = dt1[1];
        console.log("encrypt", encrypt);
        const token = encrypt.trim();
        if (token) {
            console.log("token");
            const result = yield jsonwebtoken_1.default.decode(token);
            console.log(result);
            if (result) {
                req.body.decoded = result;
                next();
            }
            else {
                return res.status(403).json({ msg: "Invalid token" });
            }
        }
    }
    else {
        return res.status(403).json({ msg: "Invalid token" });
    }
});
exports.checkExpiry = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const decoded = yield jsonwebtoken_1.default.decode(req.body.token);
        console.log(decoded);
        const refreshToken = jsonwebtoken_1.default.sign({ decoded }, userControllers_1.jwt_secret, {
            algorithm: 'HS384',
            expiresIn: 36000,
            issuer: 'Yash'
        });
        res.status(200).json({
            refreshToken,
            expiresIn: 36000,
            msg: 'token refreshed',
        });
    }
    catch (err) {
        res.status(400).json({ msg: err });
    }
});
exports.getIp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        // inside middleware handler
        // const clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1
        // res.json(clientIp);
        const ip = req.headers['x-forwarded-for'];
        //  var ip = req.headers["x-forwarded-for"];
        const userIp = ip.split(",")[0];
        req.body.ip = userIp;
        next();
        console.log("req------>", req);
    }
    catch (error) {
        console.log("Error Found");
        res.status(500).json(error);
    }
});
//# sourceMappingURL=auth.js.map
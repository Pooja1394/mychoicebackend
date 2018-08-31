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
const express_1 = __importDefault(require("express"));
const userModels_1 = __importDefault(require("./userModels"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const axios_1 = __importDefault(require("axios"));
const requestIp = require("request-ip");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const productModels_1 = __importDefault(require("../product/productModels"));
const supplierModels_1 = __importDefault(require("../supplier/supplierModels"));
const categoryModels_1 = __importDefault(require("../category/categoryModels"));
const brandModel_1 = __importDefault(require("../brands/brandModel"));
const util_1 = require("../util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const async_1 = __importDefault(require("async"));
exports.jwt_secret = "ADIOS AMIGOS";
const app = express_1.default();
// const download = require('picture-downloader');
const download = require("image-downloader");
const constant_1 = __importDefault(require("../config/constant"));
const en_1 = __importDefault(require("../../../language/en"));
const my_1 = __importDefault(require("../../../language/my"));
const types_1 = require("../../socket/types");
const websocket_1 = require("../../socket/websocket");
exports.register = (req, res) => {
    console.log("Signup ", req.body);
    if (req.body.firstName &&
        req.body.lastName &&
        req.body.userName &&
        req.body.email &&
        req.body.password) {
        req.body.password = bcryptjs_1.default.hashSync(req.body.password, 10);
        if (req.body.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            userModels_1.default.findOne({ email: req.body.email }, (err, result) => {
                console.log("result ---->", result);
                if (err) {
                    res.status(500).json(err);
                }
                else if (result) {
                    res.status(400).json({
                        msg: "User Already exist"
                    });
                }
                else {
                    console.log("req.-------->", req.body);
                    req.body.lastLogin = moment_timezone_1.default().format();
                    const user = new userModels_1.default(req.body);
                    user.save((err, result) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            console.log("err=", err);
                            res.json({
                                err: err
                            });
                        }
                        else if (result) {
                            try {
                                const payload = {
                                    email: result.toJSON().email,
                                    _id: result.toJSON()._id,
                                    userName: result.toJSON().userName
                                };
                                const token = yield util_1.createToken(payload, constant_1.default.expiresIn);
                                // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                                // console.log("ip------> " + ip);
                                const _result = result.toJSON();
                                const obj = {
                                    _id: _result._id,
                                    firstName: _result.firstName,
                                    lastName: _result.lastName,
                                    userName: _result.userName,
                                    email: _result.email,
                                    suspend: _result.suspend,
                                    status: _result.status,
                                    isEnabled: _result.isEnabled,
                                    createdBy: _result.createdBy,
                                    createdAt: _result.createdAt,
                                    updatedAt: _result.updatedAt,
                                    token: token,
                                    balance: _result.balance,
                                    expiresIn: constant_1.default.expiresIn - 86400,
                                    level: _result.level,
                                    loginType: _result.loginType,
                                    lastLogin: moment_timezone_1.default().format(),
                                    picture: "http://apimychoice.sia.co.in/public/pictures/" +
                                        _result.picture,
                                    bio: "",
                                    localadd: "",
                                    state: "",
                                    city: "",
                                    township: "",
                                    lang: _result.lang,
                                    amount: _result.amount,
                                    msg: _result.lang == "en" ? en_1.default.registerok : my_1.default.registerok
                                };
                                let respondToUser = yield websocket_1.onlineUser.filter((user) => (user.type == 'admin'));
                                if (respondToUser.length > 0) {
                                    async_1.default.forEach(respondToUser, (userSession) => {
                                        userSession.ws.send(JSON.stringify({ 'type': types_1.Types.CREATE_NEW_USER, 'user': obj }));
                                    });
                                }
                                res.status(200).json(obj);
                            }
                            catch (err) {
                                res.status(400).json(err);
                            }
                        }
                    }));
                }
            });
        }
        else {
            res.status(406).json({
                statusCode: 406,
                msg: "fill email details correctley"
            });
        }
    }
    else {
        res.status(400).json({
            msg: "please fill all details first"
        });
    }
};
exports.login = (req, res) => {
    console.log("Login hited");
    if (req.body.userName && req.body.password) {
        const auth = req.headers.authorization;
        userModels_1.default.findOneAndUpdate({ userName: req.body.userName }, { $set: { lastLogin: moment_timezone_1.default().format() } }, (err, result) => {
            console.log(result);
            if (err) {
                res.status(500).json(err);
            }
            else if (result) {
                console.log("ids", result._id);
                const num_attempt = parseInt(req.body.attempt);
                if (num_attempt < 5) {
                    if (result.status == false) {
                        bcryptjs_1.default.compare(req.body.password, result.toJSON().password, (err, data) => {
                            console.log("result" + data + err);
                            if (err) {
                                res.status(500).json(err);
                            }
                            if (data) {
                                // if (result.status == false) {
                                // post= db.post++;
                                const payload = {
                                    email: result.toJSON().email,
                                    _id: result.toJSON()._id
                                };
                                const token = jsonwebtoken_1.default.sign(payload, exports.jwt_secret, {
                                    algorithm: "HS384",
                                    expiresIn: constant_1.default.expiresIn,
                                    issuer: "Yash"
                                });
                                const _result = result.toJSON();
                                const obj = {
                                    _id: _result._id,
                                    firstName: _result.firstName,
                                    lastName: _result.lastName,
                                    userName: _result.userName,
                                    email: _result.email,
                                    suspend: _result.suspend,
                                    status: _result.status,
                                    isEnabled: _result.isEnabled,
                                    createdBy: _result.createdBy,
                                    createdAt: _result.createdAt,
                                    updatedAt: _result.updatedAt,
                                    balance: _result.balance,
                                    token: token,
                                    expiresIn: constant_1.default.expiresIn - 86400,
                                    ipAddress: req.body.ip,
                                    level: _result.level,
                                    loginType: _result.loginType,
                                    lastLogin: _result.lastLogin,
                                    is_reset: _result.is_reset,
                                    bio: _result.bio,
                                    localadd: _result.localadd,
                                    state: _result.state,
                                    city: _result.city,
                                    township: _result.township,
                                    amount: _result.amount,
                                    picture: constant_1.default.url + _result.picture,
                                    lang: _result.lang,
                                    msg: "User Signed In"
                                };
                                res.json(obj);
                                // // }
                                // else {
                                // }
                            }
                            else {
                                res.status(400).json({
                                    msg: "wrong password"
                                });
                            }
                        });
                    }
                    else {
                        res.status(401).json({
                            msg: "Your Account Is Blocked"
                        });
                    }
                }
                else {
                    userModels_1.default.updateOne({ userName: req.body.userName }, { $set: { status: true, suspend: true } }, (err, data) => {
                        if (err)
                            throw err;
                        res.status(401).json({
                            msg: "Your account is blocked"
                        });
                    });
                }
            }
            else {
                res.status(400).json({
                    msg: "User Not Found!"
                });
            }
        });
    }
    else {
        console.log("m out username");
        res.status(400).json({
            // msg: "userName not registered"
            msg: "Invalid parameters!"
        });
    }
};
exports.updatebio = (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (req.body.bio) {
        //  const hii: any = req.body;
        //  console.log(`user:----${hii}`);
        try {
            yield userModels_1.default.findOneAndUpdate({ email: req.body.decoded.email }, { $set: { bio: req.body.bio } }, { new: true }, (err, data) => {
                console.log(`user:----`, err);
                if (data) {
                    if (data.status == false) {
                        if (data.suspend == false) {
                            const _result = data.toJSON();
                            const obj = {
                                firstName: _result.firstName,
                                lastName: _result.lastName,
                                userName: _result.userName,
                                email: _result.email,
                                suspend: _result.suspend,
                                status: _result.status,
                                isEnabled: _result.isEnabled,
                                createdBy: _result.createdBy,
                                createdAt: _result.createdAt,
                                updatedAt: _result.updatedAt,
                                balance: _result.balance,
                                level: _result.level,
                                loginType: _result.loginType,
                                msg: "BIO UPDATED",
                                bio: req.body.bio
                            };
                            res.json(obj);
                        }
                        else {
                            res.status(400).json({ msg: "Your account is Suspended" });
                        }
                    }
                    else {
                        res.status(401).json({ msg: "Your account is Blocked" });
                    }
                }
                else {
                    res.status(400).json({ msg: "data not found" });
                }
            });
        }
        catch (error) {
            console.log("Error Found");
            res.status(400).json(error);
        }
    }
});
exports.address = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("userName = ", req.body.userName);
    try {
        yield userModels_1.default.findOneAndUpdate({ email: req.body.decoded.email }, {
            $set: {
                localadd: req.body.localadd,
                state: req.body.state,
                city: req.body.city,
                township: req.body.township
            }
        }, { new: true }, (err, data) => {
            console.log(`user:----`, data);
            if (data) {
                if (data.status == false) {
                    if (data.suspend == false) {
                        const _result = data.toJSON();
                        const obj = {
                            firstName: _result.firstName,
                            lastName: _result.lastName,
                            userName: _result.userName,
                            email: _result.email,
                            suspend: _result.suspend,
                            status: _result.status,
                            isEnabled: _result.isEnabled,
                            createdBy: _result.createdBy,
                            createdAt: _result.createdAt,
                            updatedAt: _result.updatedAt,
                            balance: _result.balance,
                            level: _result.level,
                            loginType: _result.loginType,
                            bio: req.body.bio,
                            address: req.body.address,
                            msg: "ADDRESS UPDATED"
                        };
                        res.json(obj);
                    }
                    else {
                        res.status(400).json({ msg: "Your account is Suspended" });
                    }
                }
                else {
                    res.status(401).json({ msg: "Your account is Blocked" });
                }
            }
            else {
                res.status(400).json("data not found");
            }
        });
    }
    catch (error) {
        console.log("Error Found");
        res.status(400).json(error);
    }
});
exports.newPass = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("my newpass api called!");
    try {
        const data = yield userModels_1.default.findOne({
            email: req.body.decoded.email
        });
        console.log("data of update password : ", data);
        bcryptjs_1.default.compare(req.body.password, data.password, (err, result) => __awaiter(this, void 0, void 0, function* () {
            console.log("result ==>" + result + data.password);
            if (result) {
                if (data.status == false) {
                    if (data.suspend == false) {
                        console.log("result found");
                        const newPassword = yield bcryptjs_1.default.hashSync(req.body.newPassword, 10);
                        console.log("data-------> " + data.toJSON().password);
                        userModels_1.default.updateOne({ email: req.body.decoded.email }, { $set: { password: newPassword } }, (err, data) => {
                            if (err)
                                throw err;
                            else
                                res.status(200).json({
                                    msg: "Password successfuly change"
                                });
                        });
                    }
                    else {
                        res.status(400).json({ msg: "Your account is Suspended" });
                    }
                }
                else {
                    res.status(401).json({ msg: "Your account is Blocked" });
                }
            }
            else {
                console.log("result not found");
                res.status(400).json({
                    msg: "Current Password Does not match"
                });
            }
        }));
    }
    catch (error) {
        // console.log("Error Found");
        res.status(400).json(error);
    }
});
exports.forgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
    //  if (req.body.forgotPassword) {
    console.log("Entering" + req.body.decoded);
    try {
        console.log("hey all");
        yield userModels_1.default.findOne({ userName: req.body.userName }, (err, data) => {
            console.log(`user:----`, err + data);
            if (data) {
                if (data.status == false) {
                    if (data.suspend == false) {
                        res.status(200).json({
                            msg: "Please contact admin to update your Password"
                        });
                    }
                    else {
                        res.status(400).json({ msg: "Your account is Suspended" });
                    }
                }
                else {
                    res.status(401).json({ msg: "Your account is Blocked" });
                }
            }
            else {
                res.status(400).json({ msg: "Username Not found" });
            }
        });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.socialLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`user----`, req.connection.remoteAddress);
    if (req.body.access_token && req.body.is_Facebook) {
        console.log("fb running");
        try {
            const url = `https://graph.facebook.com/me?fields=id,name,first_name,last_name,email,picture.type(large)&access_token=${req.body.access_token}`;
            const fb = yield axios_1.default.get(url);
            userModels_1.default.findOne({
                email: fb.data.email
            }, (err, user) => {
                console.log("userdb---", user);
                if (err) {
                    res.status(500).json(err);
                }
                else if (user) {
                    if (user.status == false) {
                        console.log("in else user");
                        const payload = {
                            email: user.email,
                            _id: user._id
                        };
                        const token = jsonwebtoken_1.default.sign(payload, exports.jwt_secret, {
                            algorithm: "HS384",
                            expiresIn: constant_1.default.expiresIn,
                            issuer: "Yash"
                        });
                        const picture = {
                            url: fb.data.picture.data.url,
                            dest: "./src/public/images/" + user._id + ".jpg"
                        };
                        console.log("picture", user._id, fb.data.picture.data.url);
                        download
                            .image(picture)
                            .then(({ filename, image }) => {
                            console.log("File saved to", filename);
                        })
                            .catch((err) => {
                            throw err;
                        });
                        const data = {
                            _id: user._id,
                            userName: user.userName,
                            email: user.email,
                            picture: constant_1.default.url + user._id + ".jpg",
                            firstName: user.firstName,
                            lastName: user.lastName,
                            // isFacebook: true,
                            loginType: "Facebook",
                            suspend: user.suspend,
                            status: user.status,
                            isEnabled: user.isEnabled,
                            createdBy: user.createdBy,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                            localadd: user.localadd,
                            state: user.state,
                            city: user.city,
                            township: user.township,
                            balance: user.balance,
                            level: user.level,
                            token: token,
                            expiresIn: constant_1.default.expiresIn - 86400,
                            msg: "Already  Registered "
                        };
                        // res.json(data);
                        console.log("response data ", data);
                        res.status(201).json(data);
                        // res.status(201).json({ err: "already exist you can directly login" })
                    }
                    else {
                        res.status(401).json({
                            msg: "You account is blocked"
                        });
                    }
                }
                else {
                    console.log("in else fb save");
                    const payload = {
                        email: fb.data.email,
                        _id: fb.data._id
                    };
                    const token = jsonwebtoken_1.default.sign(payload, exports.jwt_secret, {
                        algorithm: "HS384",
                        expiresIn: constant_1.default.expiresIn,
                        issuer: "Yash"
                    });
                    const picture = {
                        url: fb.data.picture.data.url,
                        dest: "./src/public/images/" + fb.data.id + ".jpg"
                    };
                    // console.log("picture", user._id, fb.data.picture.data.url);
                    download
                        .image(picture)
                        .then(({ filename, image }) => {
                        console.log("File saved to", filename);
                    })
                        .catch((err) => {
                        throw err;
                    });
                    console.log("fb data----->", fb.data);
                    const obj = {
                        // id: fb.data.id,
                        userName: fb.data.name,
                        email: fb.data.email,
                        picture: constant_1.default.url + fb.data.id + ".jpg",
                        firstName: fb.data.first_name,
                        lastName: fb.data.last_name,
                        isFacebook: true,
                        loginType: "Facebook",
                        suspend: fb.data.suspend,
                        status: fb.data.status,
                        isEnabled: fb.data.isEnabled,
                        localadd: fb.data.localadd,
                        state: fb.data.state,
                        city: fb.data.city,
                        township: fb.data.township,
                        createdBy: fb.data.createdBy,
                        createdAt: fb.data.createdAt,
                        updatedAt: fb.data.updatedAt,
                        balance: fb.data.balance,
                        level: fb.data.level,
                        msg: "User Signed In"
                    };
                    const userSave = new userModels_1.default(obj);
                    // console.log("user------>", obj)
                    userSave.save((err, user_data) => {
                        // console.log('in save db', user_data)
                        if (err) {
                            res.status(400).json(err);
                        }
                        else if (user_data) {
                            // console.log( user_data);
                            const data = {
                                _id: user_data._id,
                                userName: user_data.userName,
                                email: user_data.email,
                                picture: user_data.picture,
                                firstName: user_data.firstName,
                                lastName: user_data.lastName,
                                // isFacebook: true,
                                loginType: "Facebook",
                                suspend: user_data.suspend,
                                status: user_data.status,
                                isEnabled: user_data.isEnabled,
                                createdBy: user_data.createdBy,
                                createdAt: user_data.createdAt,
                                updatedAt: user_data.updatedAt,
                                localadd: user_data.localadd,
                                state: user_data.state,
                                city: user_data.city,
                                township: user_data.township,
                                balance: user_data.balance,
                                level: user_data.level,
                                token: token,
                                expiresIn: constant_1.default.expiresIn - 86400,
                                msg: "Sccuessfully Registered "
                            };
                            res.json(data);
                            // res.status(200).json(data);
                        }
                        else {
                            console.log("in else save");
                            res.json({ msg: "in else", user_data });
                        }
                    });
                }
            });
        }
        catch (error) {
            console.log("in catch");
            // console.log("Error",error);
            // res.json(error);
            res.status(400).json({ message: "invalid value" });
        }
    }
    else {
        console.log("google running");
        try {
            console.log("entering try");
            const url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" +
                req.body.access_token;
            console.log("gmail");
            const gmail = yield axios_1.default.get(url);
            // console.log("gmail data", gmail.data);
            userModels_1.default.findOne({
                email: gmail.data.email
            }, (err, user) => {
                console.log("userdb", user);
                if (err) {
                    res.status(500).json(err);
                }
                else if (user) {
                    if (user.status == false) {
                        const payload = {
                            email: user.email,
                            _id: user._id
                        };
                        const token = jsonwebtoken_1.default.sign(payload, exports.jwt_secret, {
                            algorithm: "HS384",
                            expiresIn: constant_1.default.expiresIn,
                            issuer: "Yash"
                        });
                        const picture = {
                            url: gmail.data.picture,
                            dest: "./src/public/images/" + user._id + ".jpg"
                        };
                        console.log("picture", user._id, gmail.data.picture);
                        download
                            .image(picture)
                            .then(({ filename, image }) => {
                            console.log("File saved to", filename);
                        })
                            .catch((err) => {
                            throw err;
                        });
                        const data = {
                            _id: user._id,
                            userName: user.userName,
                            email: user.email,
                            picture: constant_1.default.url + user._id + ".jpg",
                            firstName: user.firstName,
                            lastName: user.lastName,
                            // isFacebook: false,
                            loginType: "Google",
                            suspend: user.suspend,
                            status: user.status,
                            isEnabled: user.isEnabled,
                            createdBy: user.createdBy,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                            balance: user.balance,
                            bio: user.bio,
                            localadd: user.localadd,
                            state: user.state,
                            city: user.city,
                            township: user.township,
                            level: user.level,
                            token: token,
                            expiresIn: constant_1.default.expiresIn - 86400,
                            msg: "Already Registered "
                        };
                        res.status(200).json(data);
                        // res.status(201).json({ err: "Already registered you can directly login" })
                    }
                    else {
                        res.status(401).json({ msg: "Your account is blocked" });
                    }
                }
                else {
                    const payload = {
                        email: gmail.data.email,
                        _id: gmail.data._id
                    };
                    const token = jsonwebtoken_1.default.sign(payload, exports.jwt_secret, {
                        algorithm: "HS384",
                        expiresIn: constant_1.default.expiresIn,
                        issuer: "Yash"
                    });
                    const picture = {
                        url: gmail.data.picture,
                        dest: "./src/public/images/" + gmail.data.id + ".jpg"
                    };
                    download
                        .image(picture)
                        .then(({ filename, image }) => {
                        console.log("File saved to", filename);
                    })
                        .catch((err) => {
                        throw err;
                    });
                    const obj = {
                        // id: gmail.data.id,
                        userName: gmail.data.name,
                        email: gmail.data.email,
                        picture: constant_1.default.url + gmail.data.id + ".jpg",
                        firstName: gmail.data.given_name,
                        lastName: gmail.data.family_name,
                        isFacebook: true,
                        loginType: "Google",
                        suspend: gmail.data.suspend,
                        status: gmail.data.status,
                        isEnabled: gmail.data.isEnabled,
                        bio: gmail.data.bio,
                        localadd: gmail.data.localadd,
                        state: gmail.data.state,
                        city: gmail.data.city,
                        township: gmail.data.township,
                        createdBy: gmail.data.createdBy,
                        createdAt: gmail.data.createdAt,
                        updatedAt: gmail.data.updatedAt,
                        balance: gmail.data.balance,
                        level: gmail.data.level,
                        msg: "User Signed In"
                    };
                    const userSave = new userModels_1.default(obj);
                    // console.log("user------>", obj)
                    userSave.save((err, user_data) => {
                        // console.log('in save db', user_data)
                        if (err) {
                            res.status(400).json(err);
                        }
                        else if (user_data) {
                            // console.log( user_data);
                            const data = {
                                _id: user_data.id,
                                userName: user_data.userName,
                                email: user_data.email,
                                picture: user_data.picture,
                                firstName: user_data.firstName,
                                lastName: user_data.lastName,
                                // isFacebook: false,
                                loginType: "Google",
                                suspend: user_data.suspend,
                                status: user_data.status,
                                isEnabled: user_data.isEnabled,
                                createdBy: user_data.createdBy,
                                createdAt: user_data.createdAt,
                                updatedAt: user_data.updatedAt,
                                bio: user_data.bio,
                                localadd: user_data.localadd,
                                state: user_data.state,
                                city: user_data.city,
                                township: user_data.township,
                                balance: user_data.balance,
                                level: user_data.level,
                                token: token,
                                expiresIn: constant_1.default.expiresIn - 86400,
                                msg: "Sccuessfully Registered "
                            };
                            res.status(200).json(data);
                        }
                        else {
                            console.log("in else save");
                            res.json({ msg: "in else", user_data });
                        }
                    });
                }
            });
        }
        catch (error) {
            // console.log("Error",error);
            // res.json(error);
            res.status(400).json({ message: "invalid value" });
        }
    }
});
exports.getBio = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield userModels_1.default.findOne({ email: req.body.decoded.email }, (err, data) => {
            console.log(`user:----`, err, data);
            if (data) {
                const obj = {
                    bio: data.bio,
                    isEnabled: data.isEnabled
                };
                res.json(obj);
            }
            else {
                res.status(400).json("Cannot find Username with this token");
            }
        });
    }
    catch (error) {
        console.log("Error Found");
        res.status(500).json(error);
    }
});
exports.imgUpload = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("imgupload api called");
    try {
        console.log("File name===>", req.file.filename);
        userModels_1.default.findOne({ email: req.body.decoded.email }, (err, data) => {
            console.log("userData====> ", data);
            if (data) {
                console.log("status---->" + data.status + data.suspend);
                if (data.status == false) {
                    if (data.suspend == false) {
                        userModels_1.default.updateOne({ email: req.body.decoded.email }, { $set: { picture: req.file.filename } }, err => {
                            res.status(200).json({
                                msg: data.lang == "en" ? en_1.default.picupload : my_1.default.picupload,
                                picture: constant_1.default.url + req.file.filename
                            });
                        });
                    }
                    else {
                        res.status(400).json({ msg: "Your account is Suspended" });
                    }
                }
                else {
                    res.status(401).json({ msg: "Your account is Blocked" });
                }
            }
            else {
                throw err;
            }
        });
    }
    catch (error) {
        console.log("error = ", error);
        res.status(400).json(error);
    }
});
exports.removepicture = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = yield userModels_1.default.findById({ _id: req.body.decoded._id });
    if (data) {
        if (data.status == false) {
            if (data.suspend == false) {
                data.picture = "";
                yield data.save();
                res.status(200).json({
                    msg: data.lang == "en" ? en_1.default.picdelete : my_1.default.picdelete
                });
            }
            else {
                res.status(400).json({ msg: "Your account is Suspended" });
            }
        }
        else {
            res.status(401).json({ msg: "Your account is Blocked" });
        }
    }
    else {
        res.status(400).json({
            msg: "data not found"
        });
    }
});
exports.getPicData = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield userModels_1.default.findOne({ email: req.body.decoded.email }, (err, data) => {
            console.log(`user:----`, err, data);
            const status = data.status;
            if (data && status == false) {
                const obj = {
                    picture: constant_1.default.url + data.picture
                };
                res.json(obj);
            }
            else if (status == true) {
                res.status(401).json({
                    msg: data.lang == "en" ? en_1.default.statusblocked : my_1.default.statusblocked
                });
            }
            else {
                res.status(400).json({
                    msg: "Cannot find Picture with this token"
                });
            }
        });
    }
    catch (error) {
        console.log("Error Found");
        res.status(500).json(error);
    }
});
exports.getIp = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        // inside middleware handler
        // const clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1
        // res.json(clientIp);
        const ip = req.headers["x-forwarded-for"];
        //  var ip = req.headers["x-forwarded-for"];
        const userIp = ip.split(",")[0];
        console.log("req------>", req);
        res.json(userIp);
    }
    catch (error) {
        console.log("Error Found");
        res.status(500).json(error);
    }
});
exports.language = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield userModels_1.default.findOneAndUpdate({ email: req.body.decoded.email }, { $set: { lang: req.body.lang } }, { new: true }, (err, data) => {
            console.log(`user:----`, err, data);
            const status = data.status;
            const suspend = data.suspend;
            if (data && status == false) {
                if (data && suspend == false) {
                    const obj = {
                        lang: req.body.lang
                    };
                    res.json({
                        lang: data.lang,
                        msg: req.body.lang == "en" ? en_1.default.lang : my_1.default.lang
                    });
                }
                else if (suspend == true) {
                    res.status(401).json({
                        msg: data.lang == "en" ? en_1.default.suspendblocked : my_1.default.suspendblocked
                    });
                }
            }
            else if (status == true) {
                res.status(401).json({
                    msg: data.lang == "en" ? en_1.default.statusblocked : my_1.default.statusblocked
                });
            }
            else {
                res.status(400).json({
                    msg: "Langauge not updated"
                });
            }
        });
    }
    catch (error) {
        console.log("Error Found");
        res.status(500).json(error);
    }
});
exports.resetPass = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("my newpass api called!");
    try {
        const data = yield userModels_1.default.findOne({ userName: req.body.userName });
        console.log("data of update password : ", data);
        if (data) {
            if (data.status == false) {
                if (data.suspend == false) {
                    console.log("result found");
                    const newPassword = yield bcryptjs_1.default.hashSync(req.body.newPassword, 10);
                    console.log("data-------> " + data.toJSON().password);
                    userModels_1.default.updateOne({ userName: req.body.userName }, { $set: { password: newPassword, is_reset: false } }, (err, result) => {
                        if (err) {
                            throw err;
                        }
                        else
                            res.status(200).json({
                                msg: data.lang == "en" ? en_1.default.passchng : my_1.default.passchng
                            });
                    });
                }
                else {
                    res.status(400).json({ msg: "Your account is Suspended" });
                }
            }
            else {
                res.status(401).json({ msg: "Your account is Blocked" });
            }
        }
        else {
            console.log("result not found");
            res.status(400).json({
                msg: "Cannot reset the password"
            });
        }
    }
    catch (error) {
        console.log("Error Found");
        res.status(500).json(error);
    }
});
exports.updateamount = (req, res) => __awaiter(this, void 0, void 0, function* () {
    //  const hii: any = req.body;
    //  console.log(`user:----${hii}`);
    try {
        yield userModels_1.default.findOneAndUpdate({ email: req.body.email }, { $set: { amount: req.body.amount } }, { new: true }, (err, data) => {
            console.log(`user:----`, err);
            if (data) {
                if (data.status == false) {
                    if (data.suspend == false) {
                        const _result = data.toJSON();
                        const obj = {
                            firstName: _result.firstName,
                            lastName: _result.lastName,
                            userName: _result.userName,
                            email: _result.email,
                            suspend: _result.suspend,
                            status: _result.status,
                            isEnabled: _result.isEnabled,
                            createdBy: _result.createdBy,
                            createdAt: _result.createdAt,
                            updatedAt: _result.updatedAt,
                            balance: _result.balance,
                            level: _result.level,
                            loginType: _result.loginType,
                            amount: _result.amount
                        };
                        res.json(obj);
                    }
                    else {
                        res.status(400).json({ msg: "Your account is Suspended" });
                    }
                }
                else {
                    res.status(401).json({ msg: "Your account is Blocked" });
                }
            }
            else {
                res.status(400).json({ msg: "data not found" });
            }
        });
    }
    catch (error) {
        console.log("Error Found");
        res.status(400).json(error);
    }
});
exports.gettrans = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield userModels_1.default.find({}, { _id: 1, balance: 1 }, (err, data) => {
            console.log(`user:----`, err, data);
            if (data) {
                res.json(data);
            }
            else {
                res.status(400).json(err);
            }
        });
    }
    catch (error) {
        console.log("Error Found");
        res.status(500).json(error);
    }
});
exports.deleteimg = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("Inside delete", req.body);
    // console.log('m in Action of createbuybank', req.body.action);
    try {
        if (req.body.type == "product") {
            const productData = yield productModels_1.default.findOne({ _id: req.body._id });
            // console.log('userData------userData', productData);
            productData.image.splice(req.body.index, 1);
            yield productData.save();
            res.status(200).json({ msg: "Image Deleted Successfully" });
        }
        else if (req.body.type == "supplier") {
            const supplierData = yield supplierModels_1.default.findOne({ _id: req.body._id });
            // console.log('Bank data====>', supplierData);
            const arr = supplierData.infoFile;
            console.log("arr-----", arr);
            arr.splice(req.body.index, 1);
            supplierData.infoFile = arr;
            // await supplierData.save()
            supplierData.save((err, data) => {
                res.status(200).json({ msg: "Image Deleted Successfully" });
            });
        }
        else if (req.body.type == "category") {
            const categoryData = yield categoryModels_1.default.findOne({ _id: req.body._id });
            // console.log('*****biddata', categoryData);
            categoryData.image.splice(req.body.index, 1);
            yield categoryData.save();
            res.status(200).json({ msg: "Image Deleted Successfully" });
        }
        else if (req.body.type == "brand") {
            const brandData = yield brandModel_1.default.findOne({ _id: req.body._id });
            console.log("Bank data====>", brandData);
            const arr = brandData.infoFile;
            console.log("arr-----", arr);
            arr.splice(req.body.index, 1);
            brandData.infoFile = arr;
            // await brandData.save()
            brandData.save((err, data) => {
                res.status(200).json({ msg: "Image Deleted Successfully" });
            });
        }
    }
    catch (error) {
        res.status(500).json({ msg: error });
    }
});
function changeUserType() {
    return __awaiter(this, void 0, void 0, function* () {
        let date = new Date();
        date.setMonth(date.getMonth() - 1);
        yield userModels_1.default.updateMany({ level: "Beginner", createdAt: { $lte: date.toISOString() } }, { level: 'Penny' });
    });
}
exports.changeUserType = changeUserType;
//# sourceMappingURL=userControllers.js.map
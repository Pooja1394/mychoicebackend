"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("./userControllers");
// import { verify } from "jsonwebtoken";
const auth_1 = require("../util/auth");
const permission_1 = require("../util/permission");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(undefined, 'src/public/images');
    },
    filename: function (req, file, cb) {
        cb(undefined, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = multer_1.default({
    storage: storage
});
router.post("/register", (req, res) => {
    userControllers_1.register(req, res);
});
router.post("/login", (req, res) => {
    userControllers_1.login(req, res);
});
router.put('/updatebio', auth_1.verifyToken, (req, res) => {
    userControllers_1.updatebio(req, res);
});
router.put('/updateaddress', auth_1.verifyToken, (req, res) => {
    console.log('res in update address : ', req.body.decoded.userName);
    userControllers_1.address(req, res);
});
router.put('/changepassword', auth_1.verifyToken, (req, res) => {
    userControllers_1.newPass(req, res);
});
router.post('/forgotpassword', (req, res) => {
    userControllers_1.forgotPassword(req, res);
});
router.post('/socialLogin', (req, res) => {
    userControllers_1.socialLogin(req, res);
});
router.post('/refresh', (req, res, next) => {
    auth_1.checkExpiry(req, res, next);
});
router.get('/getbio', auth_1.verifyToken, (req, res) => {
    userControllers_1.getBio(req, res);
});
router.post('/imageupload', upload.single('picture'), auth_1.verifyToken, (req, res) => {
    console.log('res in routes', req.body);
    userControllers_1.imgUpload(req, res);
});
router.get('/removeimage', auth_1.verifyToken, (req, res) => {
    userControllers_1.removepicture(req, res);
});
router.get('/getpicture', auth_1.verifyToken, (req, res) => {
    userControllers_1.getPicData(req, res);
});
//  router.get('/getip', (req: Request, res: Response) => {
//     getIp (req, res);
//  });
router.post('/lang', auth_1.verifyToken, (req, res) => {
    userControllers_1.language(req, res);
});
router.post('/resetpass', (req, res) => {
    userControllers_1.resetPass(req, res);
});
router.put('/updateamount', permission_1.varifyToken, (req, res) => {
    userControllers_1.updateamount(req, res);
});
router.get('/get', permission_1.varifyToken, (req, res) => {
    userControllers_1.gettrans(req, res);
});
router.put('/deleteimg', permission_1.varifyToken, (req, res) => {
    userControllers_1.deleteimg(req, res);
});
exports.default = router;
//# sourceMappingURL=userRoutes.js.map
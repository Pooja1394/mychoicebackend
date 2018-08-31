"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { verify } from "jsonwebtoken";
const bankControllers_1 = require("./bankControllers");
// import { createtransfer } from "./transferController";
const permission_1 = require("../util/permission");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(undefined, 'src/public/images');
    },
    filename: function (req, file, cb) {
        // cb(undefined, (typeof file.fieldname !== 'undefined') ? file.fieldname + '-' + Date.now() + path.extname(file.originalname) : '');
        cb(undefined, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = multer_1.default({
    storage: storage
});
router.post('/addbank', upload.single('picture'), permission_1.varifyToken, (req, res) => {
    bankControllers_1.addbank(req, res);
});
router.post('/editbank', upload.single('picture'), permission_1.varifyToken, (req, res) => {
    bankControllers_1.editBank(req, res);
});
// router.post('/updateimage', upload.single('picture'), varifyToken, (req: Request, res: Response) => {
//     updateImage(req, res);
// });
router.delete('/removebank', permission_1.varifyToken, (req, res) => {
    bankControllers_1.removeBank(req, res);
});
router.post('/addpackage', permission_1.varifyToken, (req, res) => {
    bankControllers_1.addpackage(req, res);
});
router.post('/getpackage', (req, res) => {
    bankControllers_1.getpackage(req, res);
});
router.post('/getbank', (req, res) => {
    bankControllers_1.getbank(req, res);
});
router.post('/updatepackage', permission_1.varifyToken, (req, res) => {
    bankControllers_1.updatePackage(req, res);
});
router.delete('/removepackage', permission_1.varifyToken, (req, res) => {
    bankControllers_1.removePackage(req, res);
});
exports.default = router;
//# sourceMappingURL=bankRoutes.js.map
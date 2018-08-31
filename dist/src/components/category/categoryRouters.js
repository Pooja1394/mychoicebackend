"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryControllers_1 = require("./categoryControllers");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const permission_1 = require("../util/permission");
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
router.post('/createcate', upload.array('image', 1), permission_1.varifyToken, (req, res) => {
    categoryControllers_1.createCate(req, res);
});
router.post('/getcate', permission_1.varifyToken, (req, res) => {
    categoryControllers_1.getCate(req, res);
});
router.delete('/deletecate', permission_1.varifyToken, (req, res) => {
    categoryControllers_1.deleteCate(req, res);
});
router.put('/updatecate', permission_1.varifyToken, upload.array('image', 1), (req, res) => {
    categoryControllers_1.updateCate(req, res);
});
router.delete('/removeimage', permission_1.varifyToken, (req, res) => {
    categoryControllers_1.removeImage(req, res);
});
router.get('/brandsearch', permission_1.varifyToken, (req, res) => {
    categoryControllers_1.brandSearch(req, res);
});
router.get('/autofillcategory/:_id', (req, res) => {
    categoryControllers_1.autoFillCategory(req, res);
});
exports.default = router;
//# sourceMappingURL=categoryRouters.js.map
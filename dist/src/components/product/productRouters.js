"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productControllers_1 = require("./productControllers");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// import usermongos from '../brands/brandModel';
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
router.post('/createproduct', upload.array('image', 15), permission_1.varifyToken, (req, res) => {
    productControllers_1.createProduct(req, res);
});
router.post('/getproduct', permission_1.varifyToken, (req, res) => {
    productControllers_1.getProduct(req, res);
});
router.delete('/deleteproduct', permission_1.varifyToken, (req, res) => {
    productControllers_1.deleteProduct(req, res);
});
router.put('/updateproduct', permission_1.varifyToken, upload.array('image', 15), (req, res) => {
    productControllers_1.updateProduct(req, res);
});
router.delete('/removeimage', permission_1.varifyToken, (req, res) => {
    productControllers_1.removeImage(req, res);
});
router.get('/searchsupplierapi', (req, res) => {
    productControllers_1.searchSupplier(req, res);
});
router.get('/categorysearch', permission_1.varifyToken, (req, res) => {
    productControllers_1.categorySearch(req, res);
});
router.get('/getbrands', permission_1.varifyToken, (req, res) => {
    productControllers_1.getBrand(req, res);
});
router.get('/getProductsByBrandId', (req, res) => {
    productControllers_1.getProductsByBrandId(req, res);
});
router.post('/autofillproduct', permission_1.varifyToken, (req, res) => {
    console.log("In routes");
    productControllers_1.autoFillProduct(req, res);
});
exports.default = router;
//# sourceMappingURL=productRouters.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brandController_1 = require("./brandController");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// import { verifyToken, checkExpiry } from "../util/auth";
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
router.post('/createbrands', upload.array('image', 7), permission_1.varifyToken, (req, res) => {
    brandController_1.createBrands(req, res);
});
router.post('/getbrands', permission_1.varifyToken, (req, res) => {
    brandController_1.getBrands(req, res);
});
router.delete('/deletebrands', permission_1.varifyToken, (req, res) => {
    brandController_1.deleteBrands(req, res);
});
router.put('/updatebrands', upload.array('image', 7), permission_1.varifyToken, (req, res) => {
    brandController_1.updateBrands(req, res);
});
router.post('/imgupload/:_id', upload.array('image', 4), (req, res) => {
    brandController_1.imgUpload(req, res);
});
router.delete('/removeimage', permission_1.varifyToken, (req, res) => {
    brandController_1.removeImage(req, res);
});
router.get('/autofillbrand', (req, res) => {
    brandController_1.autoFillBrand(req, res);
});
router.get('/filterbybrandname', (req, res) => {
    brandController_1.filterByBrandName(req, res);
});
router.get('/suppliersearch', permission_1.varifyToken, (req, res) => {
    brandController_1.supplierSearch(req, res);
});
router.get('/getsupplierbrand', permission_1.varifyToken, (req, res) => {
    console.log("you are in getSubr...");
    brandController_1.getSupplierBrand(req, res);
});
router.post('/getbrandsuplier', permission_1.varifyToken, (req, res) => {
    console.log("you are in getbrand...");
    brandController_1.getBrandSuplier(req, res);
});
exports.default = router;
//# sourceMappingURL=brandRouter.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supplierControllers_1 = require("./supplierControllers");
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
router.post('/addsupplier', upload.array('image', 7), permission_1.varifyToken, (req, res) => {
    supplierControllers_1.addSupplier(req, res);
});
router.post('/getsupplier', permission_1.varifyToken, (req, res) => {
    supplierControllers_1.getSupplier(req, res);
});
router.get('/autofillapi', permission_1.varifyToken, (req, res) => {
    supplierControllers_1.autoFillApi(req, res);
});
router.delete('/deletesupplier', permission_1.varifyToken, (req, res) => {
    supplierControllers_1.deleteSupplier(req, res);
});
router.put('/updatesupplier', upload.array('image', 7), permission_1.varifyToken, (req, res) => {
    supplierControllers_1.updateSupplier(req, res);
});
// router.post('/imgupload/:_id', upload.array('image', 4), verifyToken, (req: Request, res: Response) => {
//     imgUpload(req, res, );
// });
router.delete('/removeimage', permission_1.varifyToken, (req, res) => {
    supplierControllers_1.removeImage(req, res);
});
router.get('/filterbysuppliername', permission_1.varifyToken, (req, res) => {
    supplierControllers_1.filterBySupplierName(req, res);
});
exports.default = router;
//# sourceMappingURL=supplierRouters.js.map
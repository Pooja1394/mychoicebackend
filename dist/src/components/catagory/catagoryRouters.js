"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const catagoryControllers_1 = require("./catagoryControllers");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(undefined, 'src/components/public/images');
    },
    filename: function (req, file, cb) {
        cb(undefined, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = multer_1.default({
    storage: storage
});
router.post('/createcate', upload.array('image', 1), (req, res) => {
    catagoryControllers_1.createCate(req, res);
});
router.get('/getcate', (req, res) => {
    catagoryControllers_1.getCate(req, res);
});
router.delete('/deletecate', (req, res) => {
    catagoryControllers_1.deleteCate(req, res);
});
router.put('/updatecate', (req, res) => {
    catagoryControllers_1.updateCate(req, res);
});
router.delete('/removeimage', (req, res) => {
    catagoryControllers_1.removeImage(req, res);
});
exports.default = router;
//# sourceMappingURL=catagoryRouters.js.map
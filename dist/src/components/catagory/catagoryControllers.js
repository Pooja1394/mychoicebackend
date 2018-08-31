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
const catagoryModels_1 = __importDefault(require("./catagoryModels"));
const jwt_secret = "jangan";
const lodash_1 = __importDefault(require("lodash"));
exports.createCate = (req, res) => __awaiter(this, void 0, void 0, function* () {
    let count = 1;
    yield lodash_1.default.forEach(req.files, (element) => __awaiter(this, void 0, void 0, function* () {
        if (count === 1) {
            req.body.image = element.filename;
            count++;
        }
        else {
            req.body.infoFile = element.filename;
        }
    }));
    console.log("Brands===>", req.body);
    if (req.body.cataNameEn && req.body.cateNameMn && req.body.descriptionEn && req.body.descriptionMn
        && req.body.brandName) {
        const user = new catagoryModels_1.default(req.body);
        user.save((err, result) => {
            if (err) {
                res.json({
                    err: err
                });
            }
            else {
                const _result = result.toJSON();
                const obj = {
                    cataNameEn: _result.cataNameEn,
                    cateNameMn: _result.cateNameMn,
                    descriptionEn: _result.descriptionEn,
                    descriptionMn: _result.descriptionMn,
                    brandName: _result.brandName,
                    createdBy: _result.createdBy,
                    image: _result.image,
                    infoFile: _result.infoFile,
                    brand: _result.brand
                };
                res.json(obj);
            }
        });
    }
    else {
        res.status(400).json({ msg: 'Please fill all require fields' });
    }
});
exports.getCate = (req, res) => __awaiter(this, void 0, void 0, function* () {
    catagoryModels_1.default.find({}, (err, task) => {
        if (err)
            res.json(err);
        res.json(task);
    });
});
exports.deleteCate = (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield catagoryModels_1.default.findByIdAndRemove({ _id: req.body._id }, (err) => {
        if (err) {
            throw err;
        }
        else {
            res.status(200).json({ msg: "Data Successfully deleted" });
        }
    });
});
exports.updateCate = (req, res) => __awaiter(this, void 0, void 0, function* () {
    catagoryModels_1.default.findOneAndUpdate({ _id: req.body._id }, req.body, (err, data) => {
        if (err)
            throw err;
        else
            res.status(200).json({ msg: "Data successfully change" });
    });
});
exports.removeImage = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = yield catagoryModels_1.default.findById({ _id: req.body._id });
    if (data) {
        data.image = "";
        yield data.save();
        res.status(200).json({ mes: 'Image deleted successfully' });
    }
    else {
        res.status(400).json({ mes: 'data not found' });
    }
});
//# sourceMappingURL=catagoryControllers.js.map
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
const categoryModels_1 = __importDefault(require("./categoryModels"));
const brandModel_1 = __importDefault(require("../brands/brandModel"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const jwt_secret = "jangan";
const mongoose_1 = __importDefault(require("mongoose"));
const lodash_1 = __importDefault(require("lodash"));
// export const createCate = async (req: Request, res: Response) => {
//     if (req.body.image) {
//         let count = 1;
//         await _.forEach(req.files, async (element: any) => {
//             if (count === 1) {
//                 req.body.image = element.filename;
//                 count++;
//             }
//             else {
//                 req.body.infoFile = element.filename;
//             }
//         });
//         console.log("Brands===>", req.body);
//         if (req.body.cateNameEn && req.body.cateNameMn && req.body.descriptionEn && req.body.descriptionMn) {
//             const user = new catagorymongos(req.body);
//             user.save((err, result) => {
//                 if (err) {
//                     res.json({
//                         err: err
//                     });
//                 }
//                 else {
//                     const _result = result.toJSON();
//                     const obj = {
//                         cateNameEn: _result.cateNameEn,
//                         cateNameMn: _result.cateNameMn,
//                         descriptionEn: _result.descriptionEn,
//                         descriptionMn: _result.descriptionMn,
//                         brandName: _result.brandName,
//                         createdBy: _result.createdBy,
//                         image: _result.image,
//                         infoFile: _result.infoFile,
//                         brand: _result.brand
//                     };
//                     res.json(obj);
//                 }
//             });
//         } else {
//             res.status(400).json({ msg: 'Please fill all require fields' });
//         }
//     } else {
//         res.status(200).json({ msg: 'data will not update' });
//     }
// };
exports.createCate = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (req.body.cateNameEn && req.body.cateNameMn && req.body.descriptionMn) {
            let count = 1;
            yield lodash_1.default.forEach(req.files, (element) => __awaiter(this, void 0, void 0, function* () {
                if (count === 1) {
                    req.body.image = element.filename;
                    count++;
                }
            }));
            const data = yield categoryModels_1.default.findOne({ cateNameEn: req.body.cateNameEn, cateNameMn: req.body.cateNameMn });
            if (data) {
                res.status(400).json({ msg: 'Catagory name already exists' });
            }
            else {
                console.log("req.body.brandName", req.body.brandName);
                const brandName = JSON.parse(req.body.brandName);
                console.log("brandName", brandName);
                const ip = req.headers['x-forwarded-for'];
                const userIp = ip.split(",")[0];
                const adminData = yield admin_model_1.default.findById(mongoose_1.default.Types.ObjectId(req.body.decoded._id));
                const user = new categoryModels_1.default({
                    cateNameEn: req.body.cateNameEn,
                    cateNameMn: req.body.cateNameMn,
                    descriptionEn: req.body.descriptionEn,
                    descriptionMn: req.body.descriptionMn,
                    brandName: brandName,
                    brand: brandName,
                    status: req.body.status,
                    createdBy: {
                        name: adminData.userName,
                        img: adminData.picture,
                        ip: userIp
                    },
                    image: req.body.image
                });
                const result = yield user.save();
                if (result) {
                    result.categoryID = "CAT" + result._id.toString();
                    yield result.save();
                    const _result = result.toJSON();
                    const obj = {
                        _id: _result._id,
                        cateNameEn: _result.cateNameEn,
                        cateNameMn: _result.cateNameMn,
                        descriptionEn: _result.descriptionEn,
                        descriptionMn: _result.descriptionMn,
                        brandId: _result.brandId,
                        brandName: _result.brandName,
                        createdBy: _result.createdBy,
                        image: _result.image,
                        infoFile: _result.infoFile,
                        brand: _result.brand
                    };
                    res.status(200).json(obj);
                }
            }
        }
        else {
            res.status(400).json({ msg: 'Please fill all require fields' });
        }
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ error: error });
    }
});
// export const getCate = async (req: Request, res: Response) => {
//     try {
//         await categorymongos.findOne({ _id: req.body._id }, (err, data: any) => {
//             if (data) {
//                 const obj = { data };
//                 res.json(obj);
//             } else {
//                 res.status(400).json("Can not find category");
//             }
//         });
//     } catch (error) {
//         res.status(500).json(error);
//     }
// };
exports.getCate = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let page = 1, limit = 10, skip = 0;
        if (req.body.page) {
            page = req.body.page;
        }
        if (req.body.limit) {
            limit = req.body.limit;
        }
        if (page > 1) {
            skip = (page - 1) * limit;
        }
        // console.log(page, limit, skip);
        const condition = {};
        if (req.body.categoryID) {
            condition.categoryID = {
                $regex: `${req.body.categoryID}`, $options: 'i'
            };
        }
        if (req.body.created) {
            const str = (req.body.created).split("-");
            const searchDate = new Date(str[1].trim() + "-" + str[2].trim() + "-" + str[0].trim()); // const date = new Date(searchDate);
            const startDate = new Date(searchDate);
            startDate.setDate(startDate.getDate() - 1);
            const endDate = searchDate;
            endDate.setDate(endDate.getDate() + 1);
            condition.createdAt = { $gt: new Date(startDate), $lt: new Date(endDate) };
        }
        if (req.body.category) {
            condition.cateNameEn = {
                $regex: `${req.body.category}`, $options: 'i'
            };
        }
        if (req.body.brand) {
            condition.brand = req.body.brand;
        }
        if (req.body.createdBy) {
            condition["createdBy.name"] = {
                $regex: `${req.body.createdBy}`, $options: 'i'
            };
        }
        if (req.body.status) {
            condition.status = req.body.status;
        }
        console.log("condition ", condition);
        const categoryData = yield categoryModels_1.default.find(condition).limit(limit).skip(skip);
        const count = yield categoryModels_1.default.count(condition);
        res.status(201).json({
            totalPages: Math.ceil(count / limit),
            data: categoryData
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.deleteCate = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = yield categoryModels_1.default.findByIdAndRemove({ _id: req.body._id });
    if (data) {
        yield data.save();
        res.status(200).json({
            msg: 'Data successfully deleted'
        });
    }
    else {
        res.status(400).json({
            msg: 'Data not found'
        });
    }
});
exports.updateCate = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const condition = {};
        const image = [];
        if (req.body.imageType == "image") {
            yield lodash_1.default.forEach(req.files, (element) => __awaiter(this, void 0, void 0, function* () {
                condition.image = element.filename;
            }));
        }
        if (req.body.cateNameEn) {
            condition.cateNameEn = req.body.cateNameEn;
        }
        if (req.body.cateNameMn) {
            condition.cateNameMn = req.body.cateNameMn;
        }
        if (req.body.descriptionEn) {
            condition.descriptionEn = req.body.descriptionEn;
        }
        if (req.body.descriptionMn) {
            condition.descriptionMn = req.body.descriptionMn;
        }
        if (req.body.brandName) {
            console.log("req.body.brandName", req.body.brandName);
            const brandName = JSON.parse(req.body.brandName);
            console.log("brandName", brandName);
            condition.brandName = brandName;
            condition.brand = brandName.length;
        }
        if (req.body.status) {
            condition.status = req.body.status;
        }
        console.log("condition", condition);
        const updateData = yield categoryModels_1.default.findOneAndUpdate({ _id: req.body._id }, { $set: condition }, { new: true });
        if (updateData) {
            res.status(200).json(updateData);
        }
    }
    catch (error) {
        console.log("error", error);
        res.status(400).json({ error: error });
    }
    // try {
    //     let count = 1;
    //     await _.forEach(req.files, async (element: any) => {
    //         if (count === 1) {
    //             req.body.image = element.filename;
    //             count++;
    //         }
    //         else {
    //             req.body.infoFile = element.filename;
    //         }
    //     });
    //     const data: any = await categorymongos.findOneAndUpdate({ _id: req.body._id }, { $set: { cateNameEn: req.body.cateNameEn, cateNameMn: req.body.cateNameMn, descriptionEn: req.body.descriptionEn, descriptionMn: req.body.descriptionMn, brandName: req.body.brandName, image: req.body.image, status: req.body.status } }, { new: true });
    //     if (data) {
    //         res.status(200).json(data);
    //     } else {
    //         res.status(400).json({ msg: "error while updating" });
    //     }
    // } catch (error) {
    //     res.status(500).json({ error: error });
    // }
});
exports.removeImage = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = yield categoryModels_1.default.findById({ _id: req.body._id });
    if (data) {
        data.image = "";
        yield data.save();
        res.status(200).json({
            msg: 'Image successfully deleted'
        });
    }
    else {
        res.status(400).json({
            msg: 'Data not found'
        });
    }
});
// export const searchApiBrand = async (req: Request, res: Response) => {
//     let condition;
//     if (req.query.type == "brandNameEn") {
//         condition = {
//             "brandNameEn": {
//                 $regex: `^${req.query.search}`,
//                 $options: 'i'
//             }
//         };
//     }
//     if (req.query.type == "brandNameMn") {
//         condition = {
//             "brandNameMn": {
//                 $regex: `^${req.query.search}`,
//                 $options: 'i'
//             }
//         };
//     }
//     brandSerch.find(condition, (err, data) => {
//         if (err) throw err;
//         else {
//             res.json(data);
//         }
//     });
// };
exports.brandSearch = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const condition = {};
        if (req.query.search) {
            condition.brandNameEn = {
                $regex: `${req.query.search}`,
                $options: 'i'
            };
        }
        console.log(condition);
        const data = yield brandModel_1.default.find(condition, { brandNameEn: 1 });
        res.status(200).json({
            data: data
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});
exports.autoFillCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
    categoryModels_1.default.find({ _id: req.params._id }, (err, task) => {
        if (err)
            res.json(err);
        res.json(task);
    });
});
//# sourceMappingURL=categoryControllers.js.map
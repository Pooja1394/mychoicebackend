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
const productModels_1 = __importDefault(require("./productModels"));
const categoryModels_1 = __importDefault(require("../category/categoryModels"));
const supplierModels_1 = __importDefault(require("../supplier/supplierModels"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const brandModel_1 = __importDefault(require("../brands/brandModel"));
const jwt_secret = "jangan";
const mongoose_1 = __importDefault(require("mongoose"));
const lodash_1 = __importDefault(require("lodash"));
const constant_1 = __importDefault(require("../config/constant"));
// export const createProduct = async (req: Request, res: Response) => {
//     const image: any = [];
//     await _.forEach(req.files, async (element: any) => {
//         image.push(element.filename);
//     });
//     req.body.image = image;
//     console.log("Brands===>", req.body);
//     if (req.body.productNameEn && req.body.productNameMn && req.body.descriptionEn &&
//         req.body.descriptionMn && req.body.video) {
//         const user = new productmongos(req.body);
//         user.save((err, result) => {
//             if (err) {
//                 res.json({
//                     err: err
//                 });
//             }
//             else {
//                 const _result = result.toJSON();
//                 const obj = {
//                     productNameEn: _result.productNameEn,
//                     productNameMn: _result.productNameMn,
//                     descriptionEn: _result.descriptionEn,
//                     descriptionMn: _result.descriptionMn,
//                     video: _result.video,
//                     footerDesc: _result.footerDesc,
//                     quantity: _result.quantity,
//                     productTag: _result.productTag,
//                     retailPrice: _result.retailPrice,
//                     profit: _result.profit,
//                     supplierName: _result.supplierName,
//                     brand: _result.brand,
//                     createdBy: _result.createdBy,
//                     image: _result.image
//                 };
//                 res.json(obj);
//             }
//         });
//     } else {
//         res.status(400).json({ msg: 'Please fill all require fields' });
//     }
// };
exports.createProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("in create product");
    try {
        if (req.body.productNameEn && req.body.productNameMn && req.body.descriptionMn) {
            const image = [];
            yield lodash_1.default.forEach(req.files, (element) => __awaiter(this, void 0, void 0, function* () {
                image.push(element.filename);
            }));
            req.body.image = image;
            const data = yield productModels_1.default.find({ productNameEn: req.body.productNameEn, productNameMn: req.body.productNameMn });
            if (data.length > 0) {
                res.status(400).json({ msg: 'Product name already exists' });
            }
            else {
                const ip = req.headers['x-forwarded-for'];
                const userIp = ip.split(",")[0];
                console.log("req.body.brand", req.body.brand);
                const supplierName = JSON.parse(req.body.supplierName);
                console.log("supplierName", supplierName);
                const brand = JSON.parse(req.body.brand);
                console.log("brand", brand);
                const adminData = yield admin_model_1.default.findById(mongoose_1.default.Types.ObjectId(req.body.decoded._id));
                const user = new productModels_1.default({
                    productNameEn: req.body.productNameEn,
                    productNameMn: req.body.productNameMn,
                    descriptionEn: req.body.descriptionEn,
                    descriptionMn: req.body.descriptionMn,
                    video: req.body.video,
                    footerDescEn: req.body.footerDescEn,
                    footerDescMn: req.body.footerDescMn,
                    quantity: req.body.quantity,
                    productTag: req.body.productTag,
                    retailPrice: req.body.retailPrice,
                    profit: req.body.profit,
                    supplierName: supplierName,
                    supplierList: req.body.supplierList,
                    brand: brand,
                    category: req.body.category,
                    categoryList: req.body.categoryList,
                    status: req.body.status,
                    createdBy: {
                        name: adminData.userName,
                        img: adminData.picture,
                        ip: userIp
                    },
                    image: req.body.image
                });
                const updateBrand = yield brandModel_1.default.update({ "_id": mongoose_1.default.Types.ObjectId(brand.id) }, { $inc: { product: 1 } }, { new: true });
                console.log(updateBrand);
                const result = yield user.save();
                if (result) {
                    result.productID = "PRD" + result._id.toString();
                    yield result.save();
                    const _result = result.toJSON();
                    const obj = {
                        productNameEn: _result.productNameEn,
                        productNameMn: _result.productNameMn,
                        descriptionEn: _result.descriptionEn,
                        descriptionMn: _result.descriptionMn,
                        video: _result.video,
                        footerDescEn: _result.footerDescEn,
                        footerDescMn: _result.footerDescMn,
                        quantity: _result.quantity,
                        productTag: _result.productTag,
                        retailPrice: _result.retailPrice,
                        profit: _result.profit,
                        supplierName: _result.supplierName,
                        brand: _result.brand,
                        category: _result.category,
                        createdBy: _result.createdBy,
                        image: constant_1.default.url + _result.image
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
exports.getProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        if (req.body.productID) {
            condition.productID = {
                $regex: `${req.body.productID}`, $options: 'i'
            };
        }
        if (req.body.productName) {
            condition.productNameEn = {
                $regex: `${req.body.productName}`, $options: 'i'
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
        if (req.body.quantity) {
            condition.quantity = {
                $regex: `${req.body.quantity}`, $options: 'i'
            };
        }
        if (req.body.retailPrice) {
            condition.retailPrice = {
                $regex: `${req.body.retailPrice}`, $options: 'i'
            };
        }
        if (req.body.categoryName) {
            condition.categoryList = {
                $regex: `${req.body.categoryName}`, $options: 'i'
            };
        }
        if (req.body.brandName) {
            condition["brand.name"] = {
                $regex: `${req.body.brandName}`, $options: 'i'
            };
        }
        if (req.body.supplierName) {
            condition.supplierList = {
                $regex: `${req.body.supplierName}`, $options: 'i'
            };
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
        const productData = yield productModels_1.default.find(condition).limit(limit).skip(skip);
        const count = yield productModels_1.default.count(condition);
        res.status(201).json({
            totalPages: Math.ceil(count / limit),
            data: productData
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.deleteProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield productModels_1.default.findByIdAndRemove({ _id: req.body._id }, (err) => {
        if (err) {
            throw err;
        }
        else {
            res.status(200).json({ msg: "Data Successfully deleted" });
        }
    });
});
exports.updateProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const condition = {};
        let image;
        const imageData = yield productModels_1.default.findOne({ _id: req.body._id }, { image: 1 });
        image = imageData.image;
        console.log("imageData", imageData.image, typeof image);
        yield lodash_1.default.forEach(req.files, (element) => __awaiter(this, void 0, void 0, function* () {
            image.push(element.filename);
        }));
        console.log("image--->", image);
        if (image.length > 0) {
            condition.image = image;
        }
        if (req.body.productNameEn) {
            condition.productNameEn = req.body.productNameEn;
        }
        if (req.body.productNameMn) {
            condition.productNameMn = req.body.productNameMn;
        }
        if (req.body.descriptionEn) {
            condition.descriptionEn = req.body.descriptionEn;
        }
        if (req.body.descriptionMn) {
            condition.descriptionMn = req.body.descriptionMn;
        }
        if (req.body.video) {
            condition.video = req.body.video;
        }
        if (req.body.footerDescEn) {
            condition.footerDescEn = req.body.footerDescEn;
        }
        if (req.body.footerDescMn) {
            condition.footerDescMn = req.body.footerDescMn;
        }
        if (req.body.quantity) {
            condition.quantity = req.body.quantity;
        }
        if (req.body.productTag) {
            condition.productTag = req.body.productTag;
        }
        if (req.body.profit) {
            condition.profit = req.body.profit;
        }
        if (req.body.retailPrice) {
            condition.retailPrice = req.body.retailPrice;
        }
        if (req.body.supplierName) {
            const supplierName = JSON.parse(req.body.supplierName);
            console.log("supplierName", supplierName);
            condition.supplierName = supplierName;
        }
        if (req.body.category) {
            condition.category = req.body.category;
            condition.categoryList = req.body.categoryList;
        }
        if (req.body.brand) {
            const productData = yield productModels_1.default.findOne({ _id: req.body._id });
            const updateBrand = yield brandModel_1.default.update({ "_id": mongoose_1.default.Types.ObjectId(productData.brand.id) }, { $inc: { product: -1 } }, { new: true });
            console.log(updateBrand);
            console.log("req.body.brand", req.body.brand);
            const brand = JSON.parse(req.body.brand);
            console.log("brand", brand);
            // const supplierName: any = req.body.supplierName;
            const new_Brand = yield brandModel_1.default.update({ "_id": mongoose_1.default.Types.ObjectId(brand.id) }, { $inc: { product: 1 } }, { new: true });
            console.log(new_Brand);
            condition.brand = brand;
        }
        if (req.body.status) {
            condition.status = req.body.status;
        }
        console.log("condition", condition);
        const updateData = yield productModels_1.default.findOneAndUpdate({ _id: req.body._id }, { $set: condition }, { new: true });
        if (updateData) {
            res.status(200).json(updateData);
        }
    }
    catch (error) {
        console.log("error", error);
        res.status(400).json({ error: error });
    }
    // console.log("console---->", req.body);
    // const image: any = [];
    // await _.forEach(req.files, async (element: any) => {
    //     image.push(element.filename);
    // });
    // req.body.image = image;
    // productmongos.findOneAndUpdate({ _id: req.body._id }, {
    //     $set: {
    //         productNameEn: req.body.productNameEn,
    //         productNameMn: req.body.productNameMn,
    //         descriptionEn: req.body.descriptionEn,
    //         descriptionMn: req.body.descriptionMn,
    //         video: req.body.video,
    //         footerDescEn: req.body.footerDescEn,
    //         footerDescMn: req.body.footerDescMn,
    //         quantity: req.body.quantity,
    //         productTag: req.body.productTag,
    //         retailPrice: req.body.retailPrice,
    //         profit: req.body.profit,
    //         supplierName: req.body.supplierName,
    //         brand: req.body.brand,
    //         image: req.body.image,
    //         status: req.body.status
    //     }
    // }, (err, data: any) => {
    //     console.log("data====>", data);
    //     if (data) {
    //         res.status(200).json(data);
    //     } else {
    //         res.status(500).json({ err: err });
    //     }
    // });
});
exports.removeImage = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = yield productModels_1.default.findById({ _id: req.body._id });
    if (data) {
        data.image = "";
        yield data.save();
        res.status(200).json({ mes: 'Image deleted successfully' });
    }
    else {
        res.status(400).json({ mes: 'data not found' });
    }
});
exports.searchSupplier = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const condition = {};
        if (req.query.search) {
            condition.supplierNameEn = {
                $regex: `${req.query.search}`,
                $options: 'i'
            };
        }
        console.log(condition);
        const data = yield supplierModels_1.default.find(condition, { supplierNameEn: 1 });
        res.status(200).json({
            data: data
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});
exports.categorySearch = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const condition = {};
        if (req.query.search) {
            condition.cateNameEn = {
                $regex: `${req.query.search}`,
                $options: 'i'
            };
        }
        console.log(condition);
        const data = yield categoryModels_1.default.find(condition, { cateNameEn: 1 });
        res.status(200).json({
            data: data
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});
exports.getBrand = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = yield brandModel_1.default.find({}, { brandNameEn: 1 });
    res.status(201).json({ data });
});
exports.getProductsByBrandId = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const products = yield productModels_1.default.find({ "brand.id": req.query.id }).select('productNameEn');
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.autoFillProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield productModels_1.default.findOne({ _id: req.body._id }, (err, task) => {
        if (err)
            res.json(err);
        res.json({ task });
    });
});
//# sourceMappingURL=productControllers.js.map
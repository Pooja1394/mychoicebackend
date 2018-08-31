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
const brandModel_1 = __importDefault(require("./brandModel"));
const supplierModels_1 = __importDefault(require("../supplier/supplierModels"));
const supplierModels_2 = __importDefault(require("../supplier/supplierModels"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const jwt_secret = "jangan";
const mongoose_1 = __importDefault(require("mongoose"));
const lodash_1 = __importDefault(require("lodash"));
exports.createBrands = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (req.body.brandNameEn && req.body.descriptionEn && req.body.descriptionMn && req.body.designation) {
            let count = 1;
            const image = [];
            yield lodash_1.default.forEach(req.files, (element) => __awaiter(this, void 0, void 0, function* () {
                if (count === 1) {
                    req.body.image = element.filename;
                    count++;
                }
                else {
                    image.push(element.filename);
                }
                req.body.infoFile = image;
            }));
            const data = yield brandModel_1.default.find({ brandNameEn: req.body.brandNameEn, brandNameMn: req.body.brandNameMn });
            if (data.length > 0) {
                res.status(400).json({ msg: 'Brand name already exists' });
            }
            else {
                console.log("req.body.supplierName", req.body.supplierName);
                const supplierName = JSON.parse(req.body.supplierName);
                console.log("supplierName", supplierName);
                const supplierName1 = req.body.supplierName;
                const ip = req.headers['x-forwarded-for'];
                const userIp = ip.split(",")[0];
                const adminData = yield admin_model_1.default.findById(mongoose_1.default.Types.ObjectId(req.body.decoded._id));
                const user = new brandModel_1.default({
                    brandNameEn: req.body.brandNameEn,
                    brandNameMn: req.body.brandNameMn,
                    descriptionEn: req.body.descriptionEn,
                    descriptionMn: req.body.descriptionMn,
                    supplierName: supplierName,
                    authPerson: req.body.authPerson,
                    designation: req.body.designation,
                    address: req.body.address,
                    supplier: supplierName.length,
                    supplierList: req.body.supplierList,
                    createdBy: {
                        name: adminData.userName,
                        img: adminData.picture,
                        ip: userIp
                    },
                    status: req.body.status,
                    image: req.body.image,
                    infoFile: req.body.infoFile,
                    town: req.body.town,
                    state: req.body.state
                });
                const result = yield user.save();
                lodash_1.default.forEach(supplierName, function (value) {
                    return __awaiter(this, void 0, void 0, function* () {
                        console.log(value);
                        const updateSupp = yield supplierModels_1.default.update({ "_id": mongoose_1.default.Types.ObjectId(value.id) }, { $inc: { brand: 1 } }, { new: true });
                        console.log(updateSupp);
                    });
                });
                if (result) {
                    result.brandID = "BRN" + result._id.toString();
                    yield result.save();
                    const _result = result.toJSON();
                    const obj = {
                        brandNameEn: _result.brandNameEn,
                        brandNameMn: _result.brandNameMn,
                        descriptionEn: _result.descriptionEn,
                        descriptionMn: _result.descriptionMn,
                        supplierName: _result.supplierName,
                        authPerson: _result.authPerson,
                        designation: _result.designation,
                        address: _result.address,
                        town: _result.town,
                        status: _result.status,
                        createdBy: _result.createdBy,
                        state: _result.state,
                        image: _result.image,
                        infoFile: _result.infoFile,
                        product: _result.product,
                        supplier: _result.supplier
                    };
                    res.status(200).json([obj]);
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
exports.getBrands = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        if (req.body.brandName) {
            condition.brandNameEn = {
                $regex: `${req.body.brandName}`, $options: 'i'
            };
        }
        if (req.body.brandID) {
            condition.brandID = {
                $regex: `${req.body.brandID}`, $options: 'i'
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
        if (req.body.product) {
            condition.product = req.body.product;
        }
        if (req.body.supplier) {
            condition.supplier = req.body.supplier;
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
        const brandData = yield brandModel_1.default.find(condition).limit(limit).skip(skip);
        const count = yield brandModel_1.default.count(condition);
        res.status(201).json({
            totalPages: Math.ceil(count / limit),
            data: brandData
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.filterByBrandName = (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield brandModel_1.default
        .find({ brandNameEn: new RegExp('^' + req.query.brandNameEn, "i") }, (err, data) => {
        if (err) {
            throw err;
        }
        else {
            res.status(200).json(data);
        }
    });
});
exports.deleteBrands = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const data = yield brandModel_1.default.findByIdAndRemove({ _id: req.body._id });
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
    }
    catch (error) {
        console.log("error", error);
        res.status(400).json({ error: error });
    }
});
exports.updateBrands = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const condition = {};
        console.log(req.body.imageType, req.body.imageType == "image", req.body.imageType == "infoFile", req.body.imageType == "both");
        console.log("gfufjfugm>>>>>>>> ", req.body.imageType, req.body.imageType == "image", req.body.imageType == "infoFile", req.body.imageType == "both");
        if (req.body.imageType == "image") {
            const condition = {};
            lodash_1.default.forEach(req.files, (element) => __awaiter(this, void 0, void 0, function* () {
                console.log("enter", element);
                //             image.push(element.filename);
                brandModel_1.default.update({ _id: req.body._id }, {
                    $set: {
                        image: element.filename
                    }
                }, (err, update) => {
                    console.log("update", update);
                });
            }));
            res.json({ msg: "ok" });
        }
        if (req.body.imageType == "infoFile") {
            const condition = {};
            lodash_1.default.forEach(req.files, (element) => __awaiter(this, void 0, void 0, function* () {
                console.log("enter", element);
                //             image.push(element.filename);
                brandModel_1.default.update({ _id: req.body._id }, {
                    $push: {
                        infoFile: element.filename
                    }
                }, (err, update) => {
                    console.log("update", update);
                });
            }));
            res.json({ msg: "ok" });
        }
        if (req.body.imageType == "both") {
            const condition = {};
            lodash_1.default.forEach(req.files, (element) => __awaiter(this, void 0, void 0, function* () {
                console.log("enter", element);
                //             image.push(element.filename);
                brandModel_1.default.update({ _id: req.body._id }, {
                    $push: {
                        image: element.filename,
                        infoFile: element.filename
                    }
                }, (err, update) => {
                    console.log("update", update);
                });
            }));
            res.json({ msg: "ok" });
        }
        if (req.body.supplierName) {
            const brandData = yield brandModel_1.default.findOne({ _id: req.body._id });
            yield lodash_1.default.forEach(brandData.supplierName, function (value) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log(value);
                    const updateSupp = yield supplierModels_1.default.update({ "_id": mongoose_1.default.Types.ObjectId(value.id) }, { $inc: { brand: -1 } }, { new: true });
                    console.log(updateSupp);
                });
            });
            console.log("req.body.supplierName", req.body.supplierName);
            const supplierName = JSON.parse(req.body.supplierName);
            console.log("supplierName", supplierName);
            // const supplierName: any = req.body.supplierName;
            yield lodash_1.default.forEach(supplierName, function (value) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log(value);
                    const updateSupp = yield supplierModels_1.default.update({ "_id": mongoose_1.default.Types.ObjectId(value.id) }, { $inc: { brand: 1 } }, { new: true });
                    console.log(updateSupp);
                });
            });
            condition.supplierName = supplierName;
            condition.supplier = supplierName.length;
            condition.supplierList = req.body.supplierList;
        }
        if (req.body.brandNameEn) {
            condition.brandNameEn = req.body.brandNameEn;
        }
        if (req.body.brandNameMn) {
            condition.brandNameMn = req.body.brandNameMn;
        }
        if (req.body.descriptionEn) {
            condition.descriptionEn = req.body.descriptionEn;
        }
        if (req.body.descriptionMn) {
            condition.descriptionMn = req.body.descriptionMn;
        }
        if (req.body.authPerson) {
            condition.authPerson = req.body.authPerson;
        }
        if (req.body.designation) {
            condition.designation = req.body.designation;
        }
        if (req.body.address) {
            condition.address = req.body.address;
        }
        if (req.body.town) {
            condition.town = req.body.town;
        }
        if (req.body.status) {
            condition.status = req.body.status;
        }
        if (req.body.state) {
            condition.state = req.body.state;
        }
        console.log("condition", condition);
        const updateData = yield brandModel_1.default.findOneAndUpdate({ _id: req.body._id }, { $set: condition }, { new: true });
        if (updateData) {
            res.status(200).json(updateData);
        }
    }
    catch (error) {
        console.log("error", error);
        res.status(400).json({ error: error });
    }
    // let count = 1;
    // await _.forEach(req.files, async (element: any) => {
    //     if (count === 1) {
    //         req.body.image = element.filename;
    //         count++;
    //     }
    //     else {
    //         req.body.infoFile = element.filename;
    //     }
    // });
    // await brandmongos.findOneAndUpdate({ _id: req.body._id },
    //     {
    //         $set: {
    //             brandNameEn: req.body.brandNameEn,
    //             brandNameMn: req.body.brandNameMn,
    //             descriptionEn: req.body.descriptionEn,
    //             descriptionMn: req.body.descriptionMn,
    //             supplierName: req.body.supplierName,
    //             authPerson: req.body.authPerson,
    //             designation: req.body.designation,
    //             address: req.body.address,
    //             town: req.body.town,
    //             status: req.body.status,
    //             // createdBy: req.body.createdBy,
    //             state: req.body.state,
    //             image: req.body.image,
    //             infoFile: req.body.infoFile,
    //             // product: req.body.product,
    //             // supplier: req.body.supplier
    //         },
    //     }, { new: true }, (err, data) => {
    //         if (err) {
    //             res.status(500).json({ msg: err });
    //         } else {
    //             res.status(200).json(data);
    //         }
    //     }
    // );
});
exports.autoFillBrand = (req, res) => __awaiter(this, void 0, void 0, function* () {
    brandModel_1.default
        .find({ _id: req.query.id }, (err, task) => {
        if (err)
            res.json(err);
        res.json(task);
    });
});
exports.imgUpload = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // console.log('ssss----', req.files)
    if (!req.params._id) {
        res.status(400).json({ msg: 'Enter Id in params' });
    }
    else {
        try {
            const array = [];
            yield array.push(req.files);
            yield lodash_1.default.forEach(array[0], (element) => __awaiter(this, void 0, void 0, function* () {
                // console.log("File name===>", element.filename)
                yield brandModel_1.default
                    .findOneAndUpdate({
                    '_id': req.params._id
                }, {
                    $push: {
                        "image": element.filename
                    }
                }, { new: true });
            }));
            res.status(200).json({
                msg: "Image successfully uploaded",
            });
        }
        catch (error) {
            const newLocal = res.status(400).json(error);
        }
    }
});
// export const removeImage = async (req: Request, res: Response) => {
//     const data: any = await brandmongos
//         .findById({ _id: req.body._id  });
//     if (data) {
//         data.image = "" && data.infoFile == "";
//         await data.save();
//         res.status(200).json({ msg: 'Image deleted successfully' });
//     } else {
//         res.status(400).json({ msg: 'data not found' });
//     }
// };
exports.removeImage = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const data = yield brandModel_1.default.findById({ _id: req.body._id });
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
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ error: error });
    }
});
exports.supplierSearch = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const condition = {};
        if (req.query.search) {
            condition.supplierNameEn = {
                $regex: `${req.query.search}`,
                $options: 'i'
            };
        }
        console.log(condition);
        const data = yield supplierModels_2.default.find(condition, { supplierNameEn: 1 });
        res.status(200).json({
            data: data
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.getSupplierBrand = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const supplierData = yield supplierModels_1.default.find({}, { supplierNameEn: 1, _id: 1 });
        res.status(200).json(supplierData);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.getBrandSuplier = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("body getsupplbra===>", req.body);
    try {
        const brands = yield brandModel_1.default.find({ "supplierName.id": req.body.supplierID }, { brandNameEn: 1, brandID: 1, _id: 1 });
        console.log("bands", brands);
        res.status(200).json(brands);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
//# sourceMappingURL=brandController.js.map
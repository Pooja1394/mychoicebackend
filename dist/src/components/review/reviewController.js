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
const packageModel_1 = __importDefault(require("./packageModel"));
const reviewModel_1 = __importDefault(require("./reviewModel"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
exports.jwt_secret = "jangan";
const mongoose_1 = __importDefault(require("mongoose"));
// export const createPackage = async (req: Request, res: Response) => {
//     try {
//         const reviewData: any = await reviewmongo.find({ _id: req.body._id }, { reviewName: 1 });
//         const user = new packagemongo({
//             packageName: req.body.packageName,
//             review: reviewData
//         });
//         const result: any = await user.save();
//         if (result) {
//              await result.save();
//             const _result = result.toJSON();
//             const obj = {
//                 packageName: _result.packageName,
//                 _id: _result._id,
//                 review: _result.review
//             };
//             res.status(200).send(obj);
//         }
//     } catch (error) {
//         console.log("error", error);
//         res.status(500).send({ error: error });
//     }
// };
exports.createPackage = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const ip = req.headers['x-forworded-for'];
        const userIp = ip.split(',')[0];
        const reviewAdd = req.body.reviewName;
        const reviewData = yield reviewModel_1.default.find({ _id: req.body._id }, { reviewName: 1 });
        const adminData = yield admin_model_1.default.findById(mongoose_1.default.Types.ObjectId(req.body.decoded._id));
        if (reviewData.length)
            reviewData[0].reviewName.push(reviewAdd);
        const user = new packageModel_1.default({
            packageName: req.body.packageName,
            status: req.body.status,
            review: reviewData,
            createdBy: {
                name: adminData.userName,
                img: adminData.picture,
                ip: userIp
            }
        });
        const result = yield user.save();
        if (result) {
            result.packageID = result._id.toString();
            yield result.save();
            const _result = result.toJSON();
            const obj = {
                packageName: _result.packageName,
                _id: _result.packageID,
                review: _result.review,
                status: _result.status
            };
            res.status(200).json(obj);
        }
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ error: error });
    }
});
// export const addReview: any = (req: Request, res: Response) => {
//     if (req.body.reviewName) {
//         reviewmongo.findOne({ reviewName: req.body.reviewName },
//             async (err, result: any) => {
//                 if (err) {
//                     res.status(500).json(err);
//                 }
//                 else if (result) {
//                     console.log('in else result');
//                     res.status(400).json({
//                         msg: "Review Name Already exist"
//                     });
//                 }
//                 else {
//                     const user = new reviewmongo({
//                         reviewName: req.body.reviewName,
//                     });
//                     user.save(async (err, data: any) => {
//                         if (err) {
//                             res.json({
//                                 err: err
//                             });
//                         }
//                         else if (data) {
//                           const obj = {
//                                 reviewName: data.reviewName,
//                                 _id: data._id
//                             };
//                             res.status(200).json({
//                                 obj
//                             });
//                         }
//                     });
//                 }
//             });
//     }
//     else {
//         res.status(406).json({
//             statusCode: 406,
//             msg: "fill all details correctly",
//         });
//     }
// };
exports.addReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const user = new reviewModel_1.default({
        reviewName: req.body.reviewName
    });
    const result = yield user.save();
    if (result) {
        result.reviewID = result._id.toString();
        yield result.save();
        const _result = result.toJSON();
        const obj = {
            reviewName: _result.reviewName,
            _id: _result.reviewID
        };
        res.status(200).json(obj);
    }
});
exports.getReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        const condition = {};
        if (req.body.reviewID) {
            condition.reviewID = {
                $regex: `${req.body.reviewID}`, $options: 'i'
            };
        }
        if (req.body.reviewName) {
            condition.reviewName = {
                $regex: `${req.body.reviewName}`, $options: 'i'
            };
        }
        const testReview = yield reviewModel_1.default.find(condition, { _id: 0 }).limit(limit).skip(skip);
        const count = yield reviewModel_1.default.count(condition);
        res.status(201).json({
            totalpage: Math.ceil(count / limit),
            data: testReview
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
// export const addReviewName = async (req: Request, res: Response) => {
//     packagemongo.findOne({ packageName: req.body.packageName }, async function (err, data: any) {
//         if (err)
//             throw err;
//         else {
//             if (data) {
//                 packagemongo.update(
//                     {
//                         packageName: req.body.packageName
//                     },
//                     {
//                         $push: { review: req.body.review }
//                     },
//                     { upsert: true },
//                     function (err, result) {
//                         if (err) {
//                             console.log('err:  ' + err);
//                         }
//                         else {
//                             res.status(200).send(result);
//                         }
//                     }
//                 );
//             } else {
//                 res.status(400).send("data not found");
//             }
//         }
//     });
// };
//# sourceMappingURL=reviewController.js.map
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
const lodash_1 = __importDefault(require("lodash"));
exports.createPackage = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (req.body.packageName) {
            const ip = req.headers['x-forwarded-for'];
            let userIp;
            if (ip) {
                userIp = ip.split(',')[0];
            }
            else {
                userIp = "no ip";
            }
            const reviewAdd = req.body.reviewName;
            let review = [];
            const adminData = yield admin_model_1.default.findOne({ _id: req.body.decoded }, { userName: 1, picture: 1 });
            console.log('dehbfh', adminData);
            yield lodash_1.default.forEach(req.body.review, (reviews) => __awaiter(this, void 0, void 0, function* () {
                review.push(req.body.reviews);
            }));
            const user = new packageModel_1.default({
                packageName: req.body.packageName,
                status: req.body.status,
                review: req.body.review,
                createdBy: {
                    name: adminData.userName,
                    img: adminData.picture,
                    ip: userIp
                }
            });
            user.save((err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log("err=", err);
                    res.json({
                        err: err
                    });
                }
                else if (data) {
                    const obj = {
                        packageName: data.packageName,
                        _id: data.packageID,
                        review: data.review,
                        createdBy: data.createdBy,
                        status: data.status
                    };
                    res.status(200).json(obj);
                }
            }));
        }
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ error: error });
    }
});
exports.addReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = yield reviewModel_1.default.find({ name: req.body.name });
    if (data.length > 0) {
        res.status(400).json({ msg: 'Review name already exists' });
    }
    else {
        const user = new reviewModel_1.default({
            name: req.body.name
        });
        const result = yield user.save();
        if (result) {
            yield result.save();
            const _result = result.toJSON();
            const obj = {
                name: _result.name
            };
            res.status(200).json("Successfully added");
        }
    }
});
exports.getReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let page = 1, limit = 5, skip = 0;
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
        const testReview = yield reviewModel_1.default.find(condition).limit(limit).skip(skip);
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
//# sourceMappingURL=packageController.js.map
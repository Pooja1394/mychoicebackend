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
const reviewManagmentModel_1 = __importDefault(require("./reviewManagmentModel"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const async_1 = __importDefault(require("async"));
const productModels_1 = __importDefault(require("../product/productModels"));
const userModels_1 = __importDefault(require("../user/userModels"));
const userFeedbackModel_1 = __importDefault(require("./userFeedbackModel"));
const chalk_1 = __importDefault(require("chalk"));
exports.createReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const ip = req.headers['x-forwarded-for'];
        let userIp;
        if (ip) {
            userIp = ip.split(',')[0];
        }
        else {
            userIp = "no ip";
        }
        // const pacData: any = await packageModel.findOne({ _id: "5b1b7e3bce8808463d3b37f2" }, { review: 1 });
        const productData = yield productModels_1.default.findOne({ _id: req.body.productId }, { image: 1, productNameEn: 1, });
        const adminData = yield admin_model_1.default.findOne({ email: "admin@gmail.com" }, { userName: 1, picture: 1 });
        const userData = yield userModels_1.default.findOne({ _id: req.body.decoded._id });
        console.log("hello", userData);
        const allData = new reviewManagmentModel_1.default({
            productID: req.body.productId,
            productNameEn: productData.productNameEn,
            image: productData.image,
            review: req.body.review,
            deliverPerson: {
                name: "Sunil",
                image: userData.picture,
                ip: userIp
            },
            reviewedBy: {
                name: userData.userName,
                image: userData.picture,
                ip: userIp
            },
            createdBy: {
                userName: adminData.userName,
                image: adminData.picture,
                ip: "103.206.131.110"
            },
            message: req.body.message,
            points: req.body.points
        });
        yield allData.save();
        res.status(200).json(allData);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.filterReviewManagement = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let userId = req.body.decoded._id;
        let reviews = [];
        console.log(chalk_1.default.cyan("hello"));
        const reviewManagementData = yield reviewManagmentModel_1.default.find({ productID: req.body.productId });
        async_1.default.forEach(reviewManagementData, (review, cb) => __awaiter(this, void 0, void 0, function* () {
            let feedback = yield userFeedbackModel_1.default.findOne({ reviewId: review._id, userId: userId });
            let item = review;
            let userFeedback = {};
            if (feedback) {
                if (feedback.isLike) {
                    userFeedback.userLike = feedback.isLike;
                }
                else if (feedback.isDislike) {
                    userFeedback.userDislike = feedback.isDislike;
                }
            }
            console.log("item---------->", item, '---', feedback);
            reviews.push(Object.assign({}, item.toObject(), userFeedback));
            cb();
        }), (err) => {
            res.status(200).json({ 'reviews': reviews });
        });
        // const userFeedback: any = await userFeedbackModel.find();
        // console.log("review",reviewManagementData);
        // async.forEach(userFeedback,async (feedback:any,cb)=>{
        //     if (req.body.decoded._id==feedback.userId && ){}
        // })
        // if (Object.keys(reviewManagementData).length > 0) {
        //     res.status(200).json({ success: "true", reviewManagementData});
        // } else {
        //     res.status(200).json({ success: false, reviewManagementData });
        // }
    }
    catch (error) {
        res.status(500).send(error);
    }
    // try {
    //     const reviewManagementData: any = await reviewManagementModel.find();
    //     const userFeedback: any = await userFeedbackModel.find();
    //     console.log("review",reviewManagementData);
    //     async.forEach(userFeedback,async (feedback:any,cb)=>{
    //         if (req.body.decoded._id==feedback.userId && ){}
    //     })
    //     if (Object.keys(reviewManagementData).length > 0) {
    //         res.status(200).json({ success: "true", reviewManagementData});
    //     } else {
    //         res.status(200).json({ success: false, reviewManagementData });
    //     }
    // }
    // catch (error) {
    //     res.status(500).send(error);
    // }
});
// export const filterReviewManagement = async (req: Request, res: Response) => {
//     console.log('body in filter packg--->', req.body);
//     let skip_Value;
//     let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
//     if (req.query.page != undefined && req.query.page > 1) {
//         skip_Value = limitValue * (req.query.page - 1);
//     } else { skip_Value = 0; }
//     if (req.query.limit != undefined) {
//         limitValue = parseInt(req.query.limit);
//     }
//     let condition: any = {};
//     if (req.body.productNameEn) {
//         condition.productNameEn = new RegExp('^' + req.body.productNameEn, "i");
//     }
//     if (req.body.name) {
//         condition = {
//             "createdBy.name": new RegExp('^' + req.body.name, "i"),
//         };
//     }
//     if (req.body.createdAt) {
//         const searchDate = moment(req.body.createdAt).format('YYYY-MM-DD') + "T00:00:00.000";
//         const searchGtDate = moment(req.body.createdAt).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
//         let value: any = {};
//         value = {
//             '$lt': searchGtDate,
//             '$gte': searchDate
//         };
//         condition.createdAt = value;
//     }
//     try {
//         console.log("filterpckgreview condition Is==>", condition);
//         const reviewManagementData: any = await reviewManagementModel.find(condition).sort({ createdAt: -1 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
//         const totalCount = await reviewManagementModel.count(condition);
//         console.log("total count of reviewpackg is==>", totalCount);
//         const totalPage = Math.ceil(totalCount / limitValue);
//         console.log("total Page in reviewpackg filtered===>", totalPage);
//         if (Object.keys(reviewManagementData).length > 0) {
//             res.status(200).json({ success: "true", reviewManagementData, totalPage });
//         } else {
//             res.status(200).json({ success: false, reviewManagementData });
//         }
//     }
//     catch (error) {
//         res.status(500).send(error);
//     }
// };
//# sourceMappingURL=reviewManagementController.js.map
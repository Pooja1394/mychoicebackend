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
const userFeedbackModel_1 = __importDefault(require("./userFeedbackModel"));
exports.addFeedback = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let isFeedbackExist = yield userFeedbackModel_1.default.findOne({
            reviewId: req.body.reviewId,
            userId: req.body.decoded._id
        });
        console.log("hello", userFeedbackModel_1.default);
        if (!isFeedbackExist) {
            console.log("hello");
            const allData = new userFeedbackModel_1.default({
                reviewId: req.body.reviewId,
                userId: req.body.decoded._id,
                isLike: req.body.isLike,
                isDislike: req.body.isDislike
            });
            yield allData.save();
            res.status(200).json(allData);
        }
        else {
            let updateFeedback = yield userFeedbackModel_1.default.update({
                reviewId: req.body.reviewId,
                userId: req.body.decoded._id
            }, {
                $set: {
                    isLike: req.body.isLike,
                    isDislike: req.body.isDislike
                }
            }, { new: true });
            console.log("feedback update--------->", updateFeedback);
            // await updateFeedback.save();
            res.status(200).json(updateFeedback);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.getFeedback = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const allData = yield userFeedbackModel_1.default.find();
        res.status(200).json(allData);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
//# sourceMappingURL=userFeedbackController.js.map
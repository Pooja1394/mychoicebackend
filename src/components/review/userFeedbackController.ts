import { Response, Request, NextFunction } from 'express';
import userFeedbackModel from './userFeedbackModel';

export const addFeedback = async (req: Request, res: Response) => {
    try {
        let isFeedbackExist = await userFeedbackModel.findOne({
            reviewId: req.body.reviewId,
            userId: req.body.decoded._id
        });
        console.log("hello", userFeedbackModel);
        if (!isFeedbackExist) {
            console.log("hello");
            const allData: any = new userFeedbackModel({
                reviewId: req.body.reviewId,
                userId: req.body.decoded._id,
                isLike: req.body.isLike,
                isDislike: req.body.isDislike
            });
            await allData.save();
            res.status(200).json(allData);
        } else {
            let updateFeedback = await userFeedbackModel.update({
                reviewId: req.body.reviewId,
                userId: req.body.decoded._id
            }, {
                    $set: {
                        isLike: req.body.isLike,
                        isDislike: req.body.isDislike
                    }
                }, { new: true }
            );
            console.log("feedback update--------->", updateFeedback);
            // await updateFeedback.save();
            res.status(200).json(updateFeedback);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
export const getFeedback = async (req: Request, res: Response) => {
    try {
        const allData: any = await userFeedbackModel.find();
        res.status(200).json(allData);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

import { default as mongoose } from "mongoose";
const userFeedbackSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    reviewId: {
        type: String
    },
    isLike: {
        type: Boolean,
        default: false
    },
    isDislike: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('userFeedback', userFeedbackSchema);
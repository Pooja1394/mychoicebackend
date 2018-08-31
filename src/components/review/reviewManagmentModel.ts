import { default as mongoose } from "mongoose";
const reviewManagementSchema = new mongoose.Schema({
    productID: {
        type: String
    },
    productNameEn: {
        type: String,
    },
    image: [],
    reviewedBy: {
        name: {
            type: String,
        },
        image: {
            type: String,
        },
        ip: {
            type: String,
        },
    },
    deliverPerson: {
        name: {
            type: String,
        },
        image: {
            type: String,
        },
        ip: {
            type: String,
        },
    },
    createdBy: {
        userName: {
            type: String,
        },
        image: {
            type: String,
        },
        ip: {
            type: String,
        },
    },
    points: {
        type: String,
        default: 100,
    },
    review: [],
    message: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.model('reviewmanagement', reviewManagementSchema);
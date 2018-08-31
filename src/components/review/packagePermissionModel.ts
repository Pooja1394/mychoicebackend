import { default as mongoose } from "mongoose";

const permissionReview = new mongoose.Schema({

    packageID: String,
    packageName: String,
    review: [],
    productID: {
        type: String
    },
    productNameEn: {
        type: String
    },
    image: Array,
    createdBy: {
        name: {
            type: String,
        },
        ip: {
            type: String,
        },
        image: {
            type: String,
        }
    }
}, { timestamps: true });
export default mongoose.model('permissionReview', permissionReview);
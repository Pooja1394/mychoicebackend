import { default as mongoose } from "mongoose";

const couponPackage = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    balance: {
        type: Boolean,
        required: true,
        default: true,
    },
    supplierId: {
        type: String,
        required: true,
    },
    brandId: {
        type: String,
        // required: true,
    },
    productId: {
        type: String,
        // required: true,
    },
    packageType: {
        type: String,
        required: true,
    },
    packageAmount: {
        type: String,
        required: true,
    },
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    noOfCode: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    createdBy: {
        name: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        }
    }
}, { timestamps: true });

export default mongoose.model('couponPackage', couponPackage);
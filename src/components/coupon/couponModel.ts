import { default as mongoose } from "mongoose";

const coupon = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    sendingDate: {
        type: String,
    },
    packageId: {
        type: String,
        required: true,
    },
    sales: {
        type: Date,
    },
    usedDate: {
        type: Date,
    },
    packageType: {
        type: String,
    },
    promoted: {
        type: Date,
    },
    amount: {
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

export default mongoose.model('coupon', coupon);
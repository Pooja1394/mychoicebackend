import { default as mongoose } from "mongoose";
const tradeStatusSchema = new mongoose.Schema({
    tradecreatedAt: {
        type: Date
    },
    productId: {
        type: String
    },
    productName: {
        type: String,
    },
    image: {},
    quantity: {
        type: String,
        default: 1
    },
    winningPrice: {
        type: String,
        default: 5000
    },
    retailPrice: {
        type: String,
        default: 25000
    },
    tradePrice: {
        type: String,
        default: 5000
    },
    balance: {
        type: String
    },
    serviceFee: {
        type: String,
        default: 500
    },
    sellers: {
        userName: {
            type: String
        },
        picture: {
            type: String
        },
        ip: {
            type: String
        }
    },
    buyers: {
        userName: {
            type: String
        },
        picture: {
            type: String
        },
        ip: {
            type: String
        }
    },
    tradeoutpaymentdetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tradeoutSchema'
    }
}, { timestamps: true });

export default mongoose.model('tradeStatus', tradeStatusSchema);
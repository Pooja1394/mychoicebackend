import { default as mongoose } from "mongoose";
// import { Timestamp } from "bson";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;
const serviceSchema = new Schema({

    carrierName: {
        type: String
    },
    shippingDate: {
        type: String
    },
    deliveryFee: {
        type: String
    },
    offAddress: {
        type: String
    },
    status: {
        type: String,
        default: false
    },
    _state: {
        type: String,
    },
    township: {
        type: Array,
        _id: false
    },
    division: {
        type: String
    },
    townShip: {
        type: String
    },
}, { timestamps: true });
export default mongoose.model('deliveryservice', serviceSchema);
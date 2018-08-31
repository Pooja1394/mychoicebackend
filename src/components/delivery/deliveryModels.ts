import { default as mongoose } from "mongoose";
// import { Timestamp } from "bson";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;
const deliverySchema = new Schema({
    _state: {
        type: String,
    },
    city: {
        type: String
    },
    township: {
        type: Array,
        _id: false
    },
    carrierName: {
        type: String
    },
});
export default mongoose.model('Delivery', deliverySchema);
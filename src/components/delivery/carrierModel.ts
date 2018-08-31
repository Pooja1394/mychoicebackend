import { default as mongoose } from "mongoose";
// import { Timestamp } from "bson";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;
const carrierSchema = new Schema({

    carrierName: {
        type: String
    },
    createdBy: {
        name: {
            type: String,
            default: "Admin"
        }, img: {
            type: String,
            default: ""
        }, ip: {
            type: String,
            default: ""
        }
    },
}, { timestamps: true });
export default mongoose.model('carrier', carrierSchema);
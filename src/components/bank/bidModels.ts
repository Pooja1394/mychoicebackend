import { default as mongoose } from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;
const bidSchema = new Schema({
    bidPackageName: {
        type: String,
        // require: true,
    },
    noOfBids: {
        type: String,
        // require: true,
    },
    amount: {
        type: String,
        // require: true
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
    packageId: {
        type: String,
        require: true,
        default: ""
    },
    status: {
        type: Boolean,
        default: "false"
    }
}, { timestamps: true });
export default mongoose.model('bidpackage', bidSchema);

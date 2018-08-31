import { default as mongoose } from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;
const bankSchema = new Schema({
    bankName: {
        type: String,
        // require: true,
    },
    bankShortName: {
        type: String,
        // require: true,
    },
    picture: {
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
    bankId: {
        type: String,
        require: true,
        default: ""
    },
    status: {
        type: Boolean,
        default: "false"
    }
}, { timestamps: true });
export default mongoose.model('Bank', bankSchema);

import { default as mongoose } from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;
const notification = new Schema({
    title: {
        type: String,
        // require: true,
    },
    notificationType: {
        type: Array,
        // require: true,
    },
    content: {
        type: String,
        // require: true
    },
    action: {
        type: String
    },
    checkAll: {
        type: String,
        default: false
    },
    notification: String,
    isRead: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    notificationTypeId: {
        type: mongoose.Schema.Types.ObjectId
    },
    userId: {
        type: String
    },
    sender: {
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
    time: String
}, { timestamps: true });
export default mongoose.model('notification', notification);

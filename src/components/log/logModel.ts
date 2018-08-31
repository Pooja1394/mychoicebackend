import { default as mongoose } from "mongoose";
const logSchema = new mongoose.Schema(
    {
        userId: {
            type: String
        },
        users: {
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
        email: {
            type: String
        },
        ip: {
            type: String
        },
        userType: {
            type: String
        },
        objectType: {
            type: String
        },
        activities: {
            type: String
        }
    },
    { timestamps: true });

export default mongoose.model("log", logSchema);

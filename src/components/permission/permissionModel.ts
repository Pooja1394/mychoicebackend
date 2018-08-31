import { default as mongoose } from "mongoose";

const permission = new mongoose.Schema({
    packageId: {
        type: String,
        required: true,
    },
    permissionTo: [],
    type: {
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
export default mongoose.model('permission', permission);
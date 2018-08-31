
import { default as mongoose } from 'mongoose';

const packageSchema = new mongoose.Schema({
    packageID: {
        type: String,
        require: true,
        default: ""
    },
    packageName: {
        type: String
    },
    review:
        [{
            name: { type: String },
            rating: { type: String }
        }],
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
    status: {
        type: String,
        default: "Open"
    }

}, { timestamps: true });

export default mongoose.model('packages', packageSchema);


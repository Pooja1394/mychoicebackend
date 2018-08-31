import { default as mongoose } from 'mongoose';

const DesignationSchema = new mongoose.Schema({
    DesignationId: {
        type: String
    },
    DesignationName: {
        type: String
    },
    Description: {
        type: String
    },
    privilege: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'privilege'
        }
    ],
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, { timestamps: true });

export default mongoose.model('Designation', DesignationSchema);
import { default as mongoose } from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
    DepartmentId: {
        type: String
    },
    DepartmentName: {
        type: String
    },
    Description: {
        type: String
    },
    Designation: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Designation'
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

export default mongoose.model('Department', DepartmentSchema);
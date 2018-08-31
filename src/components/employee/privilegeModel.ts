
import { default as mongoose } from 'mongoose';

const privilegeSchema = new mongoose.Schema({
    PrivilegeId: {
        type: String
    },
    privilegeName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    privilege: [{
        selectPrivilege: {
            type: String,
            required: true,
            _id: false
        },
        view: {
            type: Boolean,
            default: false
        },
        add: {
            type: Boolean,
            default: false
        },
        update: {
            type: Boolean,
            default: false
        },
        delete: {
            type: Boolean,
            default: false
        },
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });
export default mongoose.model('privilege', privilegeSchema);
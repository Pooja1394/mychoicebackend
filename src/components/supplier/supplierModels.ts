
import { default as mongoose } from 'mongoose';

const supplierSchema = new mongoose.Schema({
    supplierID: {
        type: String,
        require: true,
        default: ""
    },
    supplierNameEn: {
        type: String,
        require: true
    },
    supplierNameMn: {
        type: String,
        require: true
    },
    authPerson: {
        type: String,
        require: true
    },
    designation: {
        type: String,
        require: true
    },
    address: {
        type: String
    },
    town: {
        type: String
    },
    state: {
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
    phoneNum1: {
        type: String
    },
    phoneNum2: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    infoFile: {
        type: Array
    },
    brand: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Supplier', supplierSchema);


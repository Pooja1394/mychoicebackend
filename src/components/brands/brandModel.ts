
import { default as mongoose } from 'mongoose';

const BrandSchema = new mongoose.Schema({
    brandID: {
        type: String,
        require: true,
        default: ""
    },
    brandNameEn: {
        type: String,
        require: true
    },
    brandNameMn: {
        type: String,
        require: true
    },
    descriptionEn: {
        type: String,
        require: true
    },
    descriptionMn: {
        type: String,
        require: true
    },
    supplierName: [{
        _id: 0,
        name: {
            type: String
        },
        id: {
            type: String
        },
    }],
    supplierList: {
        type: String,
        require: true
    },
    authPerson: {
        type: String
    },
    designation: {
        type: String
    },
    address: {
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
    product: {
        type: Number,
        default: 0,
    },
    supplier: {
        type: Number,
        default: 0
    },
    town: {
        type: String
    },
    state: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('Brands', BrandSchema);



import { default as mongoose } from 'mongoose';
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    productID: {
        type: String,
        require: true,
        default: ""
    },
    productNameEn: {
        type: String,
        require: true
    },
    productNameMn: {
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
    video: {
        type: String,
        require: true
    },
    footerDescEn: {
        type: String,
        require: true
    },
    footerDescMn: {
        type: String,
        require: true
    },
    quantity: {
        type: String,
        require: true
    },
    productTag: {
        type: String,
        require: true
    },
    retailPrice: {
        type: String,
        require: true
    },
    profit: {
        type: String,
        require: true
    },
    supplierName: {
        id: mongoose.Schema.Types.ObjectId,
        name: String
    },
    category: [],
    categoryList: {
        type: String,
        require: true
    },
    brand: {
        id: mongoose.Schema.Types.ObjectId,
        name: String
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
        type: Array
    }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);




import { default as mongoose } from 'mongoose';

const cateSchema = new mongoose.Schema({
    categoryID: {
        type: String,
        require: true,
        default: ""
    },
    cateNameEn: {
        type: String,
        require: true
    },
    cateNameMn: {
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
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    brandName: [],
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
    brand: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Category', cateSchema);




import { default as mongoose } from 'mongoose';

const BrandSchema = new mongoose.Schema({
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
    brandName: {
        type: String,
        require: true
    },
    createdBy: {
        type: String,
        default: "Self"
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

export default mongoose.model('Brands', BrandSchema);



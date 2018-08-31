import { default as mongoose } from 'mongoose';

const reviewSchema = new mongoose.Schema({
    name: { type: String },
    rating: { type: String, default: 0 }

});

export default mongoose.model('review', reviewSchema);

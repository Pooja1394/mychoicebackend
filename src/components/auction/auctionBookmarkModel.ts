
import { default as mongoose } from 'mongoose';


const auctionBookmarkSchema = new mongoose.Schema({
    auctionIds: [],
    userId: {
        type: String,
    },
},

    { timestamps: true });

export default mongoose.model('AuctionBookmarks', auctionBookmarkSchema);
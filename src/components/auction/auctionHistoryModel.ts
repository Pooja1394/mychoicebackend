
import { default as mongoose } from 'mongoose';


const auctionHistorySchema = new mongoose.Schema({
    auctionId: {
        type: String,
    },
    userId: {
        type: String,
    },
    amount: {
        type: String,
    },
},

    { timestamps: true });

export default mongoose.model('AuctionHistory', auctionHistorySchema);

import { default as mongoose } from 'mongoose';


const auctionSchema = new mongoose.Schema({
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    fromTime: {
        type: String,
    },
    toTime: {
        type: String,
    },
    type: {
        type: String,
    },
    perUser: {
        type: String,
    },
    promotion: {
        type: String,
    },
    biddingLimit: {
        type: Number,
        default: 0,
    },
    retailPrice: {
        type: Number,
        default: 0,

    },
    startPrice: {
        type: Number,
        default: 0,
    },
    endPrice: {
        type: Number,
        default: 0,
    },
    priceIncrement: {
        type: Number,

    },
    timeIncrement: {
        type: String,
    },
    buyLimit: {
        buyStatus: {
            type: String,
        },
        from: {
            type: Number,
            default: 0,
        },
        to: {
            type: Number,
            default: 0,
        }
    },
    bidBack: {
        backStatus: {
            type: String,
        },
        custom: {
            type: Number,
            default: 0,
        }
    },
    bidLimit: {
        type: Number,
        default: 0,
    },
    stock: {
        type: Number,
        default: 0,
    },
    status: {
        type: Boolean,
        default: false,

    },
    products: {
        productId: String,
        productName: String,
        image: {
            type: Array
        },
    },
    createdBy: {
        userName: {
            type: String,
        },
        picture: {
            type: String,
        },
        ip: {
            type: String,
            default: "",
        }
    },
    startPercent: {
        type: Boolean,
        default: false
    },
    stopPercent: {
        type: Boolean,
        default: false
    },
    winner: {
        id: {
            type: String,
            default: '',
        },
        price: {
            type: Number,
        },
    },
    latest: {
        time: {
            type: Date,
        },
        status: {
            type: String,
        },
        user: {
            type: String,
        },
        price: {
            type: Number,
            default: 0
        }
    }
    // is_Active: {
    //     type: Boolean,
    //     default: true
    // },
},

    { timestamps: true });

export default mongoose.model('Auction', auctionSchema);
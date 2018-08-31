import { default as mongoose } from "mongoose";
const tradeoutSchema = new mongoose.Schema(
  {
    productId: {
      type: String
    },
    productName: {
      type: String
    },
    image: {},
    quantity: {
      type: String,
      default: 1
    },
    winningPrice: {
      type: String,
      default: 5000
    },
    retailPrice: {
      type: String
    },
    tradePrice: {
      type: String,
      default: 5000
    },
    balance: {
      type: String,
      default: 200
    },
    serviceFee: {
      type: String,
      default: 500
    },
    sellers: {
      userName: {
        type: String
      },
      picture: {
        type: String
      },
      ip: {
        type: String
      }
    },
    buyers: {
      userName: {
        type: String
      },
      picture: {
        type: String
      },
      ip: {
        type: String
      }
    },
    products: {},
    status: { type: String, default: "request" },
    auctiondetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction"
    }
  },
  { timestamps: true }
);

export default mongoose.model("tradeoutSchema", tradeoutSchema);

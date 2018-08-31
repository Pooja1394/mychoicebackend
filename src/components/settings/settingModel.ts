import { default as mongoose } from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;
const settingSchema = new Schema({
  bidExchange: {
        type: String
  },
  bidSellingPrice: {
      type: String
  },
  timeIncrement: {
type: String
  },
  priceIncrement: {
    type: String
      }

}, { timestamps: true });
export default mongoose.model('setting', settingSchema);

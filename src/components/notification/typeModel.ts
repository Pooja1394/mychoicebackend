import { default as mongoose } from "mongoose";
// import { Timestamp } from "bson";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;
const typeSchema = new Schema({
  type: {
        type: Array,
        _id: false
    }
});
export default mongoose.model('Type', typeSchema);
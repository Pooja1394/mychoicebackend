import { default as mongoose } from "mongoose";
import { Strategy } from "passport-local";
const depositReportsSchema = new mongoose.Schema({
   from: {
       type: Date
   },
   to: {
       type: Date
   },
   numberofUsers: {
       type: String
   },
   transfer: {
       type: String
   },
   withdraw: {
       type: String
   }
}, { timestamps: true });

export default mongoose.model('depositreports', depositReportsSchema);
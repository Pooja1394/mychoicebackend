"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoUrl = 'mongodb://127.0.0.1:27017/myChoice';
//  (<any>mongoose).Promise = bluebird;
// mongoose.connect(mongoUrl, { useMongoClient: true }).then(
//   () => {
//     console.log("Connected to database");
//     /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
// },
// ).catch(err => {
//   console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
//   //        process.exit();
// });
mongoose_1.default.connect(mongoUrl, (err) => {
    if (err) {
        console.log("Error in connecting database", err);
    }
    else {
        console.log("Database connected");
    }
});
// export default mongoose;
//# sourceMappingURL=mongoose.js.map
import mongoose from 'mongoose';
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

mongoose.connect(mongoUrl, (err) => {
  if (err) {
    console.log("Error in connecting database", err);
  }
  else {
    console.log("Database connected");
  }
});
// export default mongoose;
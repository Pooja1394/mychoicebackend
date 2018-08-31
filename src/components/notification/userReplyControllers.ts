// import express, { json } from "express";
// import jwt from "jsonwebtoken";
// import userModels from "../user/userModels";
// import admin from "../admin/admin.model";
// import auctionModel from "../auction/auctionModel";
// import decoded from "jwt-decode";
// import async from "async";
// import { Response, Request, NextFunction } from "express";
// import { error } from "util";
// import moment from "moment-timezone";
// import _ from "lodash";
// import productModels from "../product/productModels";
// import userReplyModel from "./userReplyModel";
// export const userReply = async (req: Request, res: Response) => {
//   console.log("hello");
//   try {
//     const ip: any = req.headers["x-forwarded-for"];
//     let userIp: any;
//     if (ip) {
//       userIp = ip.split(",")[0];
//       console.log("ippppppppp.....", userIp);
//     } else {
//       userIp = "no ip";
//     }
//     // console.log("hello", req.body.decoded._id);
//     const userData: any = await userModels.findOne(
//       { email: req.body.decoded.email },
//       { userName: 1, picture: 1, balance: 1 }
//     );
//     console.log("UserData----->", userData);
//     const allData: any = new userReplyModel({
//       message: req.body.message,
//       sender: {
//         userName: userData.userName,
//         picture: userData.picture,
//         ip: userIp
//       },
//     });
//     await allData.save();
//     res.status(200).json({ message: "Success", data: allData });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

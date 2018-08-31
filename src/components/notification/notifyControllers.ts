import express from "express";
import admin from "../admin/admin.model";
import mongoose from 'mongoose';
import multer from "multer";
import gcm from "node-gcm";
import axios from "axios";
import device from './deviceModel';
import Device from './deviceModel';
import Notification from './notifyModels';
import { createToken } from "../util";
import notifymongo from "./notifyModels";
import { notify } from "../admin/admin.controller";
import async, { log } from "async";
import userModels from "../user/userModels";

const app = express();
import moment from "moment";
// const download = require('picture-downloader');
import { Response, Request, NextFunction } from "express";
import notifyModels from "./notifyModels";
// export const sendnotification: any = (req: Request, res: Response) => {
//     // console.log("Signup ", req.body);
//     if (req.body.title && req.body.notificationtype && req.body.content) {
//         notifymongo.findOne({ _id: req.body._id },
//             async (err, result: any) => {
//                 console.log("result ---->", result);
//                 if (err) {
//                     console.log('err');
//                     res.status(500).json(err);
//                 }
//                 else {
//                     const url = `https://www.gstatic.com/firebasejs/5.0.4/firebase.js`;
//                     const fire = await axios.get(url);
//                     {
//                         const ip: any = req.headers['x-forwarded-for'];
//                         const userIp = ip.split(",")[0];
//                         console.log('req.-------->', req.body);
//                         const adminData: any = admin.findById(mongoose.Types.ObjectId(req.body.decoded._id));
//                         const user = new notifymongo({
//                             title: fire.data.title,
//                             notificationtype:fire.data.notificationtype,
//                             content:fire.data.content,
//                             sender: {
//                                 name: adminData.userName,
//                                 img: adminData.picture,
//                                 ip: userIp
//                             },
//                             is_reply:fire.data.is_reply,
//                             is_exchange:fire.data.is_exchange
//                         });
//                         user.save(async (err, data: any) => {
//                             if (err) {
//                                 console.log("err=", err);
//                                 res.json({

//                                     err: err
//                                 });
//                             }
//                             else if (data) {
//                                 console.log(data);

//                                 const obj = {
//                                     title: data.title,
//                                     notificationtype: data.notificationtype,
//                                     content: data.content,
//                                     sender: data.sender,
//                                     is_reply: data.is_reply,
//                                     is_exchange: data.is_exchange
//                                 };
//                                 res.status(200).json(obj);
//                             }
//                         });
//                     }
//                 }
//             });
//     }
//     else {
//         res.status(406).json({
//             statusCode: 406,
//             msg: "fill all details correctly",
//         });
//     }
// };
export const register = async (req: Request, res: Response) => {
    req.body.userId = req.body.decoded._id;
    console.log("In console", req.body);
    try {
        const deviceInfo: any = await device.findOne({ deviceId: req.body.deviceId });
        if (!deviceInfo) {
            req.body.userId = req.body.decoded._id;
            const db = new device(req.body);
            await db.save();
            res.status(201).send({
                success: true,
                data: db
            });
        } else {
            const deviceData: any = await device.findOneAndUpdate({ deviceId: req.body.deviceId }, {
                $set: {
                    token: req.body.token
                }
            });
            if (deviceData) {
                res.status(200).send({
                    success: true,
                    data: deviceData
                });
            } else {
                res.status(400).send({ success: false });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: error });
    }
};
export const sendNotification = (obj: any, info: any, token: any, cb: any) => {
    console.log("token---->", token);
    const serverkey = "AAAADp79_yU:APA91bFMKBZfNHwQ66ynTH6f5prGgEiJyfaXiBTofSqae9pd4yWToiHV6PXuO7XuRxfyNcvi78K3CO2ZN3X7TS6yP4kYK15D-3iRP-vcJqQpiD2aBSneuH9o-SezYfqfunh39QCRNGRH";
    // const token = "efMNetP1Ep0:APA91bFYXi2tT-YC6k0PtnfHatb2D185sHJdtmIdu8A-owgIrWQrA-jZ81hrunO0hdkHLpU1ufEBAPmNIzwwejFnnGy-3QzzIo4XqhwxydWYaxSZOOysDxS45Rz8FzrpoTu7ds-F7Mrx7JfePj7dNfV7lMV0PMFPpg";
    let sendData: any = obj.data;
    const body = {
        "registration_ids": [token],
        // "notification": {
        //     "click_action": "FCM_PLUGIN_ACTIVITY"
        // },
        "data": {
            "type": obj.notificationtype,
            "tab": "HomePage",
            "link": "https://fcm.googleapis.com/fcm/send",
            "title": obj.title,
            "message": obj.content,
            ...sendData,
        },
        "priority": "high",
        "content_available": true,
        "mutable_content": true,
        "click_action": "FCM_PLUGIN_ACTIVITY"
    };
    const url = "https://fcm.googleapis.com/fcm/send";
    axios({
        method: "post",
        url: url,
        headers: { "Content-Type": 'application/json', "Authorization": "Key=" + serverkey },
        data: body
    }).then(response => {
        console.log("response");
        cb(undefined, response);
        //     res.json({ name: "msg gone" ,
        //     obj
        // });
    }
    ).catch(error => {
        console.log("errrrorr");
        cb(Error);
        // res.status(error).send(error);
    });
};

export const removeDevice = async (req: Request, res: Response) => {
    try {
        if (req.body.deviceId) {
            const deviceInfo: any = await device.remove({ deviceId: req.body.deviceId });
            if (deviceInfo) {
                console.log("deviceInfo", deviceInfo);
                res.status(200).send({
                    success: true
                });
            } else {
                res.status(400).send({ success: false });
            }
        } else {
            res.status(400).json({
                message: 'provide device Id'
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: error });
    }
};
export const getAllNotifications = async (req: Request, res: Response) => {
    try {
        let skip_Value;
        let limitValue = req.query.limit ? parseInt(req.query.limit) : 20;
        if (req.query.page != undefined && req.query.page > 1) {
            skip_Value = limitValue * (req.query.page - 1);
        } else { skip_Value = 0; }
        if (req.query.limit != undefined) {
            limitValue = parseInt(req.query.limit);
        }
        await notifyModels.find({ userId: req.body.decoded._id },
            async (err, data: any) => {
                console.log(`user:----`, err, data);
                if (data) {
                    const count: any = await notifyModels.count({ userId: req.body.decoded._id });
                    console.log('count----->', count, limitValue);
                    const totalPages = Math.ceil(count / limitValue);
                    console.log('totalpage', totalPages);
                    res.status(200).json({ data, totalPages });
                } else {
                    res.status(400).json("Cannot find data");
                }
            }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
    }
    catch {
    }
};
export const userReply = async (req: Request, res: Response) => {
    console.log("hello");
    try {
        const ip: any = req.headers["x-forwarded-for"];
        let userIp: any;
        if (ip) {
            userIp = ip.split(",")[0];
            console.log("ippppppppp.....", userIp);
        } else {
            userIp = "no ip";
        }
        // console.log("hello", req.body.decoded._id);
        const userData: any = await userModels.findOne(
            { email: req.body.decoded.email },
            { userName: 1, picture: 1 }
        );
        console.log("UserData----->", userData);
        const notificationData: any = await notifyModels.find({ _id: "5b334e9778f1b23454da4b6d" });
        let action, notificationType: any;
        if (req.body.isNew) {
            action = "reply",
                notificationType = [""];
        }
        else {
            action = "";
            notificationType = ["Replied"];

        }
        console.log("data", notificationData);
        const allData: any = new notifymongo({
            title: req.body.title,
            content: req.body.message,
            action: action,
            notificationType: notificationType,
            sender: {
                name: userData.userName,
                img: userData.picture,
                ip: userIp
            },
        });
        console.log("notdata", allData);
        await allData.save();
        res.status(200).json({ message: "Success", data: allData });
    } catch (error) {
        console.log(error);
        // res.status(500).json(error);
    }
};
export const Test = async (req: Request, res: Response) => {
    console.log("hello");
    try {
        const userData: any[] = await userModels.find({});
        console.log("hello", userData);
        let data = await userData.map(async (record, index) => {
            if (typeof record.picture == "string") {
                let url = record.picture.split("/");
                let picture = url[url.length - 1];
                let data = await userModels.findOneAndUpdate({ _id: record._id }, { $set: { picture: picture } });
                console.log(data);

            }
        });
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        // res.status(500).json(error);
    }
};



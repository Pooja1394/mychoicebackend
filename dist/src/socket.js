"use strict";
// import jwt from "jsonwebtoken";
// import * as WebSocket from 'ws';
// import _ from "lodash";
// const wss = new WebSocket.Server({
//     port: 3000
// });
// const clients: any = [];
// wss.on('connection', function (ws: any) {
//     ws.on('error', function (error: any) {
//         console.log("error");
//         // console.log('Connection ' + session.id + ' error');
//         //     _.remove(clients, function (val) {
//         //         return val.id == data.id;
//         //     });
//     });
//     ws.on('close', function () {
//         console.log("close");
//         // console.log('Connection ' + session.id + ' closed');
//         //     _.remove(clients, function (val) {
//         //         return val.id == data.id;
//         //     });
//     });
//     ws.on('message', async function (message: any) {
//         const data: any = JSON.parse(message);
//         console.log('data', data);
//         if (data.action == "Online") {
//             await connect(data, ws);
//         } else if (data.action == "Offline") {
//             await disconnect(data);
//         } else if (data.action == "Status") {
//             await status(data.list, ws);
//         } else {
//             console.log("error");
//         }
//     });
// });
// async function connect(data: any, socket: any) {
//     const index: Number = await _.findIndex(clients, function (val: any) {
//         return val.sessionId == data.name;
//     });
//     if (index == -1) {
//         const inf: any = {};
//         inf.sessionId = data.name;
//         inf.ws = socket;
//         clients.push(inf);
//         console.log(" ------ if clients Online  ------- ");
//         console.log(clients);
//         socket.send(JSON.stringify({
//             id: data.name,
//             message: "Online"
//         }));
//     } else {
//         await _.remove(clients, function (val: any) {
//             return val.sessionId == data.name;
//         });
//         const inf: any = {};
//         inf.sessionId = data.name;
//         inf.ws = socket;
//         clients.push(inf);
//         console.log(" ------ else clients Online ------- ");
//         console.log(clients);
//         socket.send(JSON.stringify({
//             id: data.name,
//             message: "Online"
//         }));
//     }
// }
// async function disconnect(data: any) {
//     await _.remove(clients, function (val: any) {
//         return val.sessionId == data.name;
//     });
//     console.log(" ------ client " + data.name + " diconnected ------- ");
//     console.log(clients);
// }
// async function status(list: any, socket: any) {
//     const result: any = [];
//     const new_list = JSON.parse(list);
//     await _.forEach(new_list, async function (ID: any) {
//         const index: Number = await _.findIndex(clients, function (val: any) {
//             return val.sessionId == ID;
//         });
//         if (index == -1) {
//             result.push({ id: ID, status: "Offline" });
//         } else {
//             result.push({ id: ID, status: "Online" });
//         }
//     });
//     socket.send(JSON.stringify({ success: true, data: result }));
// }
// async function verify(data: any) {
//     try {
//         if (data.token) {
//             const result = await jwt.decode(data.token);
//             console.log(result);
//             if (result == data.user) {
//                 return true;
//             }
//             else {
//                 return false;
//             }
//         }
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// }
//# sourceMappingURL=socket.js.map
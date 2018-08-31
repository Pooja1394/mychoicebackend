"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = __importDefault(require("async"));
const websocket_1 = require("../../socket/websocket");
function CreateRandomId(length, type) {
    try {
        console.log("CreateRandomId");
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = '';
        let acc;
        for (let i = length; i > 0; i = i - 1)
            result += chars[Math.floor(Math.random() * chars.length)];
        const curr_date = new Date().getDate();
        const curr_month = (new Date().getMonth()) + 1;
        const curr_year = new Date().getFullYear();
        const date = (curr_date + curr_month + curr_year);
        const timeSec = new Date().getMilliseconds();
        if (type == 'product') {
            acc = 'PR-' + date + result + "-" + timeSec;
        }
        else if (type == 'supplier') {
            acc = 'SUP-' + date + result + "-" + timeSec;
        }
        else if (type == 'category') {
            acc = 'CAT-' + date + result + "-" + timeSec;
        }
        else if (type == 'brand') {
            acc = 'BR-' + date + result + "-" + timeSec;
        }
        else if (type == 'coupon') {
            acc = 'COU-' + date + result + "-" + timeSec;
        }
        else {
            acc = 'ID-' + date + result + "-" + timeSec;
        }
        console.log("acc", acc);
        return acc;
    }
    catch (error) {
        console.log("error", error);
        return error;
    }
}
exports.CreateRandomId = CreateRandomId;
function totalPageCount(total, limit) {
    return Math.ceil(total / limit);
}
exports.totalPageCount = totalPageCount;
function getOnlineUsers() {
    let onlineuserIds = [];
    async_1.default.forEach(websocket_1.onlineUser, (user, count) => {
        onlineuserIds.push(user.userId);
    });
    return onlineuserIds.filter((x, i, a) => a.indexOf(x) == i);
}
exports.getOnlineUsers = getOnlineUsers;
function getUserOnlineStatus(userId) {
    let onlineUsers = getOnlineUsers();
    console.log("online array------->", websocket_1.onlineUser);
    let userStatus = onlineUsers.filter((item) => item == userId);
    if (userStatus.length > 0)
        return true;
    else
        return false;
}
exports.getUserOnlineStatus = getUserOnlineStatus;
function sendToAllOnlineUsers(type, data, userType = '') {
    let respondToUser = websocket_1.onlineUser;
    if (userType != '') {
        respondToUser = websocket_1.onlineUser.filter((user) => user.type == userType);
    }
    if (respondToUser.length > 0) {
        async_1.default.forEach(respondToUser, (userSession) => {
            userSession.ws.send(JSON.stringify(Object.assign({ 'type': type }, data)));
        });
    }
}
exports.sendToAllOnlineUsers = sendToAllOnlineUsers;
function sendToOnlineUsersByConnectionId(type, data, connectionId) {
    let respondToUser = websocket_1.onlineUser;
    if (respondToUser.length > 0) {
        async_1.default.forEach(respondToUser, (userSession) => {
            if (userSession._id == connectionId)
                userSession.ws.send(JSON.stringify(Object.assign({ 'type': type }, data)));
        });
    }
}
exports.sendToOnlineUsersByConnectionId = sendToOnlineUsersByConnectionId;
//# sourceMappingURL=utility.js.map
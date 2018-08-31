import async from 'async';
import { onlineUser } from '../../socket/websocket';
import { Types } from '../../socket/types';
export function CreateRandomId(length: number, type: any): any {
    try {
        console.log("CreateRandomId");
        const chars: any = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result: any = '';
        let acc: any;
        for (let i: number = length; i > 0; i = i - 1)
            result += chars[Math.floor(Math.random() * chars.length)];
        const curr_date: any = new Date().getDate();
        const curr_month: any = (new Date().getMonth()) + 1;
        const curr_year: any = new Date().getFullYear();
        const date: any = (curr_date + curr_month + curr_year);
        const timeSec: any = new Date().getMilliseconds();
        if (type == 'product') { acc = 'PR-' + date + result + "-" + timeSec; }
        else if (type == 'supplier') { acc = 'SUP-' + date + result + "-" + timeSec; }
        else if (type == 'category') { acc = 'CAT-' + date + result + "-" + timeSec; }
        else if (type == 'brand') { acc = 'BR-' + date + result + "-" + timeSec; }
        else if (type == 'coupon') { acc = 'COU-' + date + result + "-" + timeSec; }
        else { acc = 'ID-' + date + result + "-" + timeSec; }
        console.log("acc", acc);
        return acc;
    } catch (error) {
        console.log("error", error);
        return error;
    }
}
export function totalPageCount(total: any, limit: any) {
    return Math.ceil(total / limit);
}
export function getOnlineUsers() {
    let onlineuserIds: any = [];
    async.forEach(onlineUser, (user: any, count: any) => {
        onlineuserIds.push(user.userId);
    });
    return onlineuserIds.filter((x: any, i: any, a: any) => a.indexOf(x) == i);
}
export function getUserOnlineStatus(userId: any) {
    let onlineUsers = getOnlineUsers();
    console.log("online array------->", onlineUser);
    let userStatus: any = onlineUsers.filter((item: any) => item == userId);
    if (userStatus.length > 0)
        return true;
    else
        return false;
}
export function sendToAllOnlineUsers(type: any, data: any, userType: any = '') {
    let respondToUser: any = onlineUser;
    if (userType != '') {
        respondToUser = onlineUser.filter((user: any) => user.type == userType);
    }
    if (respondToUser.length > 0) {
        async.forEach(respondToUser, (userSession: any) => {
            userSession.ws.send(JSON.stringify({
                'type': type,
                ...data
            }));
        });
    }
}
export function sendToOnlineUsersByConnectionId(type: any, data: any, connectionId: any) {
    let respondToUser: any = onlineUser;
    if (respondToUser.length > 0) {
        async.forEach(respondToUser, (userSession: any) => {
            if (userSession._id == connectionId)
                userSession.ws.send(JSON.stringify({
                    'type': type,
                    ...data
                }));
        });
    }
}

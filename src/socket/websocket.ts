import * as async from 'async';
const mwServer = require('uws').Server;
const webServer = new mwServer({ port: 5001 });
import User from '../components/user/userModels';
import Admin from '../components/admin/admin.model';
import Employee from '../components/employee/EmployeeModel';
console.log("we socket");
export let onlineUser: any = [];
export let gws: any = '';
import { Types } from './types';
import { getOnlineUsers } from '../components/util/utility';
import AuctionController from '../components/auction/auctionController';
const connectionTimeOut: any = 3;

const interval = setInterval(function ping() {
    onlineUser.filter((item: any, count: any) => {
        if (item.hearBeat == connectionTimeOut) {
            let itemId: any = item.userId;
            let userType: any = item.type;
            item.ws.send(JSON.stringify({ type: Types.ClOSE_CONNECTION }));
            item.ws.terminate();
            onlineUser.splice(count, 1);
            let isUserExist: any = onlineUser.filter((user: any) => user.userId == itemId);
            if (isUserExist.length == 0) {
                onlineUser.filter((item1: any) => {
                    if (item1.type == 'admin') {
                        item1.ws.send(JSON.stringify({ type: Types.ClOSE_CONNECTION, data: { userId: itemId, type: userType } }));
                    }
                });
            }
        } else {
            onlineUser[count].hearBeat = onlineUser[count].hearBeat + 1;
            item.ws.send(JSON.stringify({ type: Types.HEART_BEAT, 'heartBeat': 'heart-beat' }));
        }
    });
}, 5 * 1000);

webServer.on('connection', async (ws: any, req: any) => {
    const Auction = new AuctionController();
    gws = ws;
    let onlineUserId = "";
    let query = req.url.split('?');
    let userId: any = '';
    if (query[1].split('=')[0] == 'id') {
        userId = query[1].split('=')[1];
        let userData: any = await User.findOne({ '_id': userId });
        let employeeData: any = await Employee.findOne({ '_id': userId });
        let adminData: any = await Admin.findOne({ '_id': userId });
        if (userData || employeeData || adminData) {
            let connectionId = Math.random().toString(36).substr(2, 9);
            let userType = userData ? 'user' : (employeeData ? 'employee' : 'admin');
            onlineUser.push({
                userId: userId,
                ws: ws,
                type: userType,
                hearBeat: 0,
                _id: connectionId,
            });
            async.forEach(onlineUser, (user: any, cb: any) => {
                user.ws.send(JSON.stringify({ 'type': Types.NEW_CONNECTING_USER, data: { userId: userId, type: userType } }));
                // let currentUser: any = onlineUser.filter((item: any) => item.ws == ws);
                // Auction.getOpeningActions({ page: 1, limit: 10 }, currentUser[0]._id);
            });
            ws.on('message', async (message: any) => {
                let currentUser: any = onlineUser.filter((item: any) => item.ws == ws);
                let res = JSON.parse(message);
                console.log("onMessage--------->", res);
                if (currentUser && currentUser[0].hearBeat < connectionTimeOut) {
                    switch (res.type) {
                        case Types.ONLINE_USERS:
                            ws.send(JSON.stringify({ type: Types.ONLINE_USERS, users: getOnlineUsers() }));
                            break;

                        case Types.CONNECTED:
                            console.log("CONNECTED---------->", res.data);
                            break;

                        case Types.APPLY_BIDS:
                            Auction.applyBids({
                                userId: currentUser[0].userId,
                                amount: res.amount,
                                auctionId: res.auctionId,
                            }, currentUser[0]._id);
                            break;

                        case Types.NEW_MESSAGE:
                            console.log("NEW_MESSAGE---------->", res.data);
                            break;

                        case Types.AUCTION_BIDDERS:
                            Auction.auctionBidders(res.auctionId, currentUser[0]._id);
                            break;

                        case Types.HEART_BEAT:
                            onlineUser.filter((item: any, count: any) => { if (item.ws == ws) { onlineUser[count].hearBeat = 0; } });
                            break;

                        case Types.GET_OPENING_AUCTIONS:
                            Auction.getOpeningActions({ page: res.page, limit: 10 }, currentUser[0]._id, currentUser[0].userId);
                            break;

                        case Types.AUCTION_COMPLETE_DETAIL:
                            Auction.getProductDetail(res.auctionId, currentUser[0]._id, currentUser[0].userId);
                            break;

                        default:
                            console.log("default---------->", res.data);
                            break;
                    }
                }
            });
            ws.on('error', async (err: any) => {
                ws.send(JSON.stringify(err));
            });
        } else {
            ws.send(JSON.stringify({ 'type': Types.CONNECTION_FAILURE, 'message': 'Authentication Failed!' }));
        }
    }

});
function sendMessage() {
    return gws;
}
module.exports = { webServer, sendMessage, onlineUser, gws };


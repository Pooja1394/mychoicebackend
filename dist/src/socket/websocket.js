"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async = __importStar(require("async"));
const mwServer = require('uws').Server;
const webServer = new mwServer({ port: 5001 });
const userModels_1 = __importDefault(require("../components/user/userModels"));
const admin_model_1 = __importDefault(require("../components/admin/admin.model"));
const EmployeeModel_1 = __importDefault(require("../components/employee/EmployeeModel"));
console.log("we socket");
exports.onlineUser = [];
exports.gws = '';
const types_1 = require("./types");
const utility_1 = require("../components/util/utility");
const auctionController_1 = __importDefault(require("../components/auction/auctionController"));
const connectionTimeOut = 3;
const interval = setInterval(function ping() {
    exports.onlineUser.filter((item, count) => {
        if (item.hearBeat == connectionTimeOut) {
            let itemId = item.userId;
            let userType = item.type;
            item.ws.send(JSON.stringify({ type: types_1.Types.ClOSE_CONNECTION }));
            item.ws.terminate();
            exports.onlineUser.splice(count, 1);
            let isUserExist = exports.onlineUser.filter((user) => user.userId == itemId);
            if (isUserExist.length == 0) {
                exports.onlineUser.filter((item1) => {
                    if (item1.type == 'admin') {
                        item1.ws.send(JSON.stringify({ type: types_1.Types.ClOSE_CONNECTION, data: { userId: itemId, type: userType } }));
                    }
                });
            }
        }
        else {
            exports.onlineUser[count].hearBeat = exports.onlineUser[count].hearBeat + 1;
            item.ws.send(JSON.stringify({ type: types_1.Types.HEART_BEAT, 'heartBeat': 'heart-beat' }));
        }
    });
}, 5 * 1000);
webServer.on('connection', (ws, req) => __awaiter(this, void 0, void 0, function* () {
    const Auction = new auctionController_1.default();
    exports.gws = ws;
    let onlineUserId = "";
    let query = req.url.split('?');
    let userId = '';
    if (query[1].split('=')[0] == 'id') {
        userId = query[1].split('=')[1];
        let userData = yield userModels_1.default.findOne({ '_id': userId });
        let employeeData = yield EmployeeModel_1.default.findOne({ '_id': userId });
        let adminData = yield admin_model_1.default.findOne({ '_id': userId });
        if (userData || employeeData || adminData) {
            let connectionId = Math.random().toString(36).substr(2, 9);
            let userType = userData ? 'user' : (employeeData ? 'employee' : 'admin');
            exports.onlineUser.push({
                userId: userId,
                ws: ws,
                type: userType,
                hearBeat: 0,
                _id: connectionId,
            });
            async.forEach(exports.onlineUser, (user, cb) => {
                user.ws.send(JSON.stringify({ 'type': types_1.Types.NEW_CONNECTING_USER, data: { userId: userId, type: userType } }));
                // let currentUser: any = onlineUser.filter((item: any) => item.ws == ws);
                // Auction.getOpeningActions({ page: 1, limit: 10 }, currentUser[0]._id);
            });
            ws.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
                let currentUser = exports.onlineUser.filter((item) => item.ws == ws);
                let res = JSON.parse(message);
                console.log("onMessage--------->", res);
                if (currentUser && currentUser[0].hearBeat < connectionTimeOut) {
                    switch (res.type) {
                        case types_1.Types.ONLINE_USERS:
                            ws.send(JSON.stringify({ type: types_1.Types.ONLINE_USERS, users: utility_1.getOnlineUsers() }));
                            break;
                        case types_1.Types.CONNECTED:
                            console.log("CONNECTED---------->", res.data);
                            break;
                        case types_1.Types.APPLY_BIDS:
                            Auction.applyBids({
                                userId: currentUser[0].userId,
                                amount: res.amount,
                                auctionId: res.auctionId,
                            }, currentUser[0]._id);
                            break;
                        case types_1.Types.NEW_MESSAGE:
                            console.log("NEW_MESSAGE---------->", res.data);
                            break;
                        case types_1.Types.AUCTION_BIDDERS:
                            Auction.auctionBidders(res.auctionId, currentUser[0]._id);
                            break;
                        case types_1.Types.HEART_BEAT:
                            exports.onlineUser.filter((item, count) => { if (item.ws == ws) {
                                exports.onlineUser[count].hearBeat = 0;
                            } });
                            break;
                        case types_1.Types.GET_OPENING_AUCTIONS:
                            Auction.getOpeningActions({ page: res.page, limit: 10 }, currentUser[0]._id, currentUser[0].userId);
                            break;
                        case types_1.Types.AUCTION_COMPLETE_DETAIL:
                            Auction.getProductDetail(res.auctionId, currentUser[0]._id, currentUser[0].userId);
                            break;
                        default:
                            console.log("default---------->", res.data);
                            break;
                    }
                }
            }));
            ws.on('error', (err) => __awaiter(this, void 0, void 0, function* () {
                ws.send(JSON.stringify(err));
            }));
        }
        else {
            ws.send(JSON.stringify({ 'type': types_1.Types.CONNECTION_FAILURE, 'message': 'Authentication Failed!' }));
        }
    }
}));
function sendMessage() {
    return exports.gws;
}
module.exports = { webServer, sendMessage, onlineUser: exports.onlineUser, gws: exports.gws };
//# sourceMappingURL=websocket.js.map
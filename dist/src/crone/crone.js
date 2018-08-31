"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auctionController_1 = __importDefault(require("../components/auction/auctionController"));
const userControllers_1 = require("../components/user/userControllers");
const cron = require('node-cron');
const auction = new auctionController_1.default();
cron.schedule('0-59 * * * * *', function () {
    auction.changesAuctionStatus();
    userControllers_1.changeUserType();
});
//# sourceMappingURL=crone.js.map
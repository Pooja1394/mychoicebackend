import AuctionController from '../components/auction/auctionController';
import { changeUserType } from '../components/user/userControllers';
const cron = require('node-cron');
const auction = new AuctionController();

cron.schedule('0-59 * * * * *', function () {
    auction.changesAuctionStatus();
    changeUserType();
});
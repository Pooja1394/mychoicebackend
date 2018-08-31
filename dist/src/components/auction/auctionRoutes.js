"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const auctionController_1 = __importDefault(require("./auctionController"));
const express = __importStar(require("express"));
const permission_1 = require("../util/permission");
const router = express.Router();
const auction = new auctionController_1.default();
router.get('/test', (req, res) => { console.log("**You are in Auction routes**"); });
router.post('/addAuction', permission_1.varifyToken, (req, res) => { auction.addAuction(req, res); });
router.put('/updateAuction', permission_1.varifyToken, (req, res) => { auction.updateAuction(req, res); });
router.delete('/removeAuction', permission_1.varifyToken, (req, res) => { auction.removeAuction(req, res); });
router.delete('/removeMultiple', permission_1.varifyToken, (req, res) => { auction.removeMultiple(req, res); });
router.post('/duplicateProduct', permission_1.varifyToken, (req, res) => { auction.duplicateProduct(req, res); });
router.get('/getAuction', permission_1.varifyToken, (req, res) => { auction.getAuction(req, res); });
router.get('/getAuctionByObjectId', permission_1.varifyToken, (req, res) => { auction.getAuctionByObjectId(req, res); });
router.post('/auctionList', permission_1.varifyToken, (req, res) => { auction.auctionList(req, res); });
router.get('/getUpcomingActions', permission_1.varifyToken, (req, res) => { auction.getUpcomingActions(req, res); });
router.get('/getWinningActions', permission_1.varifyToken, (req, res) => { auction.getWinningActions(req, res); });
router.post('/applyBids', permission_1.varifyToken, (req, res) => { auction.applyBids(req, res); });
router.post('/createAuctionBookmark', permission_1.varifyToken, (req, res) => { auction.createAuctionBookmark(req, res); });
router.get('/changesAuctionStatus', permission_1.varifyToken, (req, res) => { auction.changesAuctionStatus(); });
router.get('/getAuctionBookmarkByUserId', permission_1.varifyToken, (req, res) => { auction.getAuctionBookmarkByUserId(req, res); });
// router.post('/getProductDetail', varifyToken, (req: Request, res: Response) => { auction.getProductDetail(req, res); });
// router.post('/auctionBidders', varifyToken, (req: Request, res: Response) => { auction.auctionBidders(req, res); });
// router.post('/getOpeningActions', varifyToken, (req: Request, res: Response) => { auction.getOpeningActions(req, res); });
exports.default = router;
//# sourceMappingURL=auctionRoutes.js.map
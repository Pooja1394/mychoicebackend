"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const auth_1 = require("../util/auth");
const permission_1 = require("../util/permission");
const buyBidController_1 = require("./buyBidController");
const router = express.Router();
router.get('/test', auth_1.verifyToken, (req, res) => { console.log("**You are in buyBidBUYBank routes**"); });
router.post('/createbuybank', auth_1.verifyToken, (req, res) => { buyBidController_1.createbuybank(req, res); });
router.post('/buybidlist', permission_1.varifyToken, (req, res) => { buyBidController_1.filterBuyBid(req, res); });
router.post('/actionbuybank', permission_1.varifyToken, (req, res) => { buyBidController_1.action(req, res); });
exports.default = router;
//# sourceMappingURL=buyBidRoutes.js.map
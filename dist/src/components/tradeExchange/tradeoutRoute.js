"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tradeoutController_1 = require("./tradeoutController");
const tradeoutPaymentController_1 = require("./tradeoutPaymentController");
const tradeStatusController_1 = require("./tradeStatusController");
const auth_1 = require("../util/auth");
const router = express_1.default.Router();
router.post("/tradeoutCreate", auth_1.verifyToken, (req, res) => {
    tradeoutController_1.tradeoutCreate(req, res);
});
router.post("/filterTradeout", auth_1.verifyToken, (req, res) => {
    tradeoutController_1.filterTradeout(req, res);
});
router.put("/acceptTradeOut", auth_1.verifyToken, (req, res) => {
    tradeoutController_1.acceptTradeOut(req, res);
});
router.put("/paidTradeOut", auth_1.verifyToken, (req, res) => {
    tradeoutController_1.paidTradeOut(req, res);
});
router.put("/buyTradeOut", auth_1.verifyToken, (req, res) => {
    tradeoutController_1.buyTradeOut(req, res);
});
router.post("/tradeoutPaymentCreate", auth_1.verifyToken, (req, res) => {
    tradeoutPaymentController_1.tradeoutPaymentCreate(req, res);
});
router.post("/filterTradeoutPayment", auth_1.verifyToken, (req, res) => {
    tradeoutPaymentController_1.filterTradeoutPayment(req, res);
});
router.post("/tradeStatusCreate", auth_1.verifyToken, (req, res) => {
    tradeStatusController_1.tradeStatusCreate(req, res);
});
router.post("/filterTradeStatus", auth_1.verifyToken, (req, res) => {
    tradeStatusController_1.filterTradeStatus(req, res);
});
exports.default = router;
//# sourceMappingURL=tradeoutRoute.js.map
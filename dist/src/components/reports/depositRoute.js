"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const depositController_1 = require("./depositController");
const router = express_1.default.Router();
router.post('/depositCreate', (req, res) => {
    depositController_1.depositCreate(req, res);
});
router.post('/tradeDetails', (req, res) => {
    depositController_1.tradeDetails(req, res);
});
exports.default = router;
//# sourceMappingURL=depositRoute.js.map
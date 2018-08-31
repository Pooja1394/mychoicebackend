"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permission_1 = require("../util/permission");
const userFeedbackController_1 = require("./userFeedbackController");
const router = express_1.default.Router();
router.post('/addFeedback', permission_1.varifyToken, (req, res) => {
    userFeedbackController_1.addFeedback(req, res);
});
router.get('/getFeedback', permission_1.varifyToken, (req, res) => {
    userFeedbackController_1.getFeedback(req, res);
});
exports.default = router;
//# sourceMappingURL=userFeedbackRoute.js.map
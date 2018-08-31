"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logController_1 = require("./logController");
const router = express_1.default.Router();
router.post('/logsCreate', (req, res) => {
    logController_1.logsCreate(req, res);
});
router.post('/filterLogs', (req, res) => {
    logController_1.filterLogs(req, res);
});
router.get('/getUserData', (req, res) => {
    logController_1.getUserData(req, res);
});
exports.default = router;
//# sourceMappingURL=logRoute.js.map
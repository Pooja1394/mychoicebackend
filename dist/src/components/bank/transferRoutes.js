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
const permission_1 = require("../util/permission");
const transferController_1 = require("./transferController");
const router = express.Router();
router.post('/createtransfer', permission_1.varifyToken, (req, res) => {
    transferController_1.createTransfer(req, res);
});
router.post('/filtertransfer', permission_1.varifyToken, (req, res) => {
    transferController_1.filterTransferApi(req, res);
});
router.get('/check', permission_1.varifyToken, (req, res) => {
    transferController_1.transferAndWithdraw(req, res);
});
exports.default = router;
//# sourceMappingURL=transferRoutes.js.map
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
const SettingController_1 = require("./SettingController");
const router = express.Router();
router.post('/setting', permission_1.varifyToken, (req, res) => {
    SettingController_1.settings(req, res);
});
router.get('/check', permission_1.varifyToken, (req, res) => {
    SettingController_1.getSetting(req, res);
});
router.put('/update', permission_1.varifyToken, (req, res) => {
    SettingController_1.updateSetting(req, res);
});
exports.default = router;
//# sourceMappingURL=settingRoutes.js.map
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
const permissionController_1 = __importDefault(require("./permissionController"));
const express = __importStar(require("express"));
const permission_1 = require("../util/permission");
const router = express.Router();
// ------------------ Permission Routes.
const coupon = new permissionController_1.default();
router.post('/createCouponPermission', permission_1.varifyToken, (req, res) => { coupon.createCouponPermission(req, res); });
router.post('/getAllCouponPermission', permission_1.varifyToken, (req, res) => { coupon.getAllCouponPermission(req, res); });
// router.post('/createReviewPermission', varifyToken, (req: Request, res: Response) => { coupon.createReviewPermission(req, res); });
// router.get('/getAllReviewPermission', varifyToken, (req: Request, res: Response) => { coupon.getAllReviewPermission(req, res); });
exports.default = router;
//# sourceMappingURL=permissionRoutes.js.map
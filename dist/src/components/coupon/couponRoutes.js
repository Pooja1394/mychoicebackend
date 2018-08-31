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
const couponController_1 = __importDefault(require("./couponController"));
const express = __importStar(require("express"));
const permission_1 = require("../util/permission");
const router = express.Router();
// ------------------ Package Routes.
const coupon = new couponController_1.default();
router.post('/createPackage', permission_1.varifyToken, (req, res) => { coupon.createPackage(req, res); });
router.post('/generatePackage', permission_1.varifyToken, (req, res) => { coupon.generatePackage(req, res); });
router.post('/getAllPackages', permission_1.varifyToken, (req, res) => { coupon.getAllPackages(req, res); });
router.post('/getAllCoupons', permission_1.varifyToken, (req, res) => { coupon.getAllCoupons(req, res); });
router.post('/updatePackage', (req, res) => { coupon.updatePackage(req, res); });
exports.default = router;
//# sourceMappingURL=couponRoutes.js.map
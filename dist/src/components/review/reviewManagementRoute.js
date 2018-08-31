"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permission_1 = require("../util/permission");
const reviewManagementController_1 = require("./reviewManagementController");
const router = express_1.default.Router();
router.post('/createReview', permission_1.varifyToken, (req, res) => {
    reviewManagementController_1.createReview(req, res);
});
router.post('/getAllReviews', permission_1.varifyToken, (req, res) => {
    reviewManagementController_1.filterReviewManagement(req, res);
});
exports.default = router;
//# sourceMappingURL=reviewManagementRoute.js.map
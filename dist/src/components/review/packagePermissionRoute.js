"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const packagePermissionController_1 = require("./packagePermissionController");
const permission_1 = require("../util/permission");
const router = express_1.default.Router();
router.post('/reviewPackage', permission_1.varifyToken, (req, res) => {
    packagePermissionController_1.createReviewPackage(req, res);
});
router.post('/packageList', permission_1.varifyToken, (req, res) => {
    packagePermissionController_1.filterPackageReview(req, res);
});
// router.post('/reviewManagement', varifyToken, (req: Request, res: Response) => {
//     reviewManagement(req, res);
// });
exports.default = router;
//# sourceMappingURL=packagePermissionRoute.js.map
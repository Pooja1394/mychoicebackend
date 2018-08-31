"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const packageController_1 = require("./packageController");
const packageList_1 = require("./packageList");
const permission_1 = require("../util/permission");
const router = express_1.default.Router();
router.post('/createpackage', permission_1.varifyToken, (req, res) => {
    console.log('=====in createpkg--->');
    packageController_1.createPackage(req, res);
});
router.post('/addreview', permission_1.varifyToken, (req, res) => {
    packageController_1.addReview(req, res);
});
router.post('/getreview', permission_1.varifyToken, (req, res) => {
    packageController_1.getReview(req, res);
});
router.post('/filterpackage', permission_1.varifyToken, (req, res) => {
    packageList_1.filterPackage(req, res);
});
exports.default = router;
//# sourceMappingURL=packageRoute.js.map
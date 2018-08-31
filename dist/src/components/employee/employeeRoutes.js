"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const permission_1 = require("../util/permission");
const privilegeController_1 = require("./privilegeController");
const DesignationController_1 = require("./DesignationController");
const DepartmentController_1 = require("./DepartmentController");
const EmployeeController_1 = require("./EmployeeController");
const router = express.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        console.log("hii");
        cb(undefined, 'src/public/images');
    },
    filename: function (req, file, cb) {
        cb(undefined, file.fieldname + Date.now() + path_1.default.extname(file.originalname));
        console.log("///" + file.fieldname + Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = multer_1.default({
    storage: storage
});
/**
 * employee test Routes.
 */
router.get('/test', (req, res) => {
    console.log("**You are in employee-test routes**");
    res.status(200).json("test is Completed!");
});
/**
 * create employee priviledges Routes.
 */
router.post('/privilege', permission_1.varifyToken, (req, res) => {
    console.log("you are in privilege creation Routes");
    privilegeController_1.priviledges(req, res);
});
/**
 * Employee priviledges filter API Routes.
 */
router.post('/searchprivilege', (req, res) => {
    console.log("you are in privilege filtering Routes");
    privilegeController_1.searchPrivilege(req, res);
});
/**
 * delete Employee priviledges API Routes.
 */
router.delete('/removeprivilege', (req, res) => {
    console.log("you are in remove privilege Routes");
    privilegeController_1.removePrivilege(req, res);
});
router.post('/addDesignation', permission_1.varifyToken, (req, res) => {
    console.log("you are in Designation creation Routes");
    DesignationController_1.addDesignation(req, res);
});
router.post('/getDesignation', (req, res) => {
    DesignationController_1.getDesignation(req, res);
});
router.delete('/removeDesignation', (req, res) => {
    DesignationController_1.removeDesignation(req, res);
});
router.post('/addDepartment', permission_1.varifyToken, (req, res) => {
    DepartmentController_1.addDepartment(req, res);
});
router.post('/getDepartment', (req, res) => {
    DepartmentController_1.getDepartment(req, res);
});
router.delete('/removeDepartment', (req, res) => {
    DepartmentController_1.removeDepartment(req, res);
});
router.post('/addEmployee', upload.single('img'), permission_1.varifyToken, (req, res) => {
    EmployeeController_1.addEmployee(req, res);
});
router.get('/getallDesignation', (req, res) => {
    EmployeeController_1.getallDesignation(req, res);
});
router.post('/getEmployee', (req, res) => {
    EmployeeController_1.getEmployee(req, res);
});
router.get('/getallDepartment', (req, res) => {
    EmployeeController_1.getallDepartment(req, res);
});
router.delete('/removeEmployee', (req, res) => {
    EmployeeController_1.removeEmployee(req, res);
});
router.get('/getallPrivileges', (req, res) => {
    console.log("hii");
    EmployeeController_1.getallPrivileges(req, res);
});
router.put('/updateDepartment', (req, res) => {
    DepartmentController_1.updateDepartment(req, res);
});
router.put('/updateDesignation', (req, res) => {
    DesignationController_1.updateDesignation(req, res);
});
router.put('/updateEmployee', upload.single('img'), (req, res) => {
    EmployeeController_1.updateEmployee(req, res);
});
router.put('/updatePriviledge', (req, res) => {
    privilegeController_1.updatePrivilege(req, res);
});
exports.default = router;
//# sourceMappingURL=employeeRoutes.js.map
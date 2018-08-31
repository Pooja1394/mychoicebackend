import * as express from 'express';
import multer from "multer";
import path from "path";
import { verifyToken, checkExpiry } from '../util/auth';
import { varifyToken } from '../util/permission';
import { Request, Response, NextFunction } from 'express';
import { priviledges, searchPrivilege, removePrivilege, updatePrivilege } from './privilegeController';
import { addDesignation, getDesignation, removeDesignation, updateDesignation } from './DesignationController';
import { addDepartment, getDepartment, removeDepartment, updateDepartment } from './DepartmentController';
import { addEmployee, getallDesignation, getallDepartment, getallPrivileges, getEmployee, removeEmployee, updateEmployee } from './EmployeeController';

const router = express.Router();

const storage: any = multer.diskStorage({
    destination: function (req, file, cb: any) {
        console.log("hii");
        cb(undefined, 'src/public/images');
    },
    filename: function (req, file, cb: any) {
        cb(undefined, file.fieldname + Date.now() + path.extname(file.originalname));
        console.log("///" + file.fieldname + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

/**
 * employee test Routes.
 */
router.get('/test', (req: Request, res: Response) => {
    console.log("**You are in employee-test routes**");
    res.status(200).json("test is Completed!");
});
/**
 * create employee priviledges Routes.
 */
router.post('/privilege', varifyToken, (req: Request, res: Response) => {
    console.log("you are in privilege creation Routes");
    priviledges(req, res);
});
/**
 * Employee priviledges filter API Routes.
 */
router.post('/searchprivilege', (req: Request, res: Response) => {
    console.log("you are in privilege filtering Routes");
    searchPrivilege(req, res);
});
/**
 * delete Employee priviledges API Routes.
 */
router.delete('/removeprivilege', (req: Request, res: Response) => {
    console.log("you are in remove privilege Routes");
    removePrivilege(req, res);
});

router.post('/addDesignation', varifyToken, (req: Request, res: Response) => {
    console.log("you are in Designation creation Routes");
    addDesignation(req, res);
});

router.post('/getDesignation', (req: Request, res: Response) => {
    getDesignation(req, res);
});

router.delete('/removeDesignation', (req: Request, res: Response) => {
    removeDesignation(req, res);
});

router.post('/addDepartment', varifyToken, (req: Request, res: Response) => {
    addDepartment(req, res);
});

router.post('/getDepartment', (req: Request, res: Response) => {
    getDepartment(req, res);
});

router.delete('/removeDepartment', (req: Request, res: Response) => {
    removeDepartment(req, res);
});

router.post('/addEmployee', upload.single('img'), varifyToken, (req: Request, res: Response) => {
    addEmployee(req, res);
});

router.get('/getallDesignation', (req: Request, res: Response) => {
    getallDesignation(req, res);
});

router.post('/getEmployee', (req: Request, res: Response) => {
    getEmployee(req, res);
});

router.get('/getallDepartment', (req: Request, res: Response) => {
    getallDepartment(req, res);
});
router.delete('/removeEmployee', (req: Request, res: Response) => {
    removeEmployee(req, res);
});
router.get('/getallPrivileges', (req: Request, res: Response) => {
    console.log("hii");
    getallPrivileges(req, res);
});
router.put('/updateDepartment', (req: Request, res: Response) => {
    updateDepartment(req, res);
});
router.put('/updateDesignation', (req: Request, res: Response) => {
    updateDesignation(req, res);
});
router.put('/updateEmployee', upload.single('img'), (req: Request, res: Response) => {
    updateEmployee(req, res);
});
router.put('/updatePriviledge', (req: Request, res: Response) => {
    updatePrivilege(req, res);
});

export default router;

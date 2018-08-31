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
const admin_controller_1 = require("./admin.controller");
const admin_controller_2 = require("./admin.controller");
const express = __importStar(require("express"));
const permission_1 = require("../util/permission");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(undefined, 'src/public/images');
    },
    filename: function (req, file, cb) {
        cb(undefined, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = multer_1.default({
    storage: storage
});
const router = express.Router();
router.get("/test", (req, res) => {
    console.log("hello");
    res.status(200).json({ msg: 'working' });
});
/**
 * Admin signup.
 */
router.post("/register", upload.single('img'), (req, res) => {
    // console.log("post AdminRoutes.......?",req.query,req.body)
    admin_controller_1.createAdmin(req, res);
});
/**
 * Admin login.
 */
router.get('/login', (req, res) => {
    admin_controller_1.adminLogin(req, res);
});
/**
 * Admin Upload Image.
 */
router.post('/uploadImage', upload.single('picture'), permission_1.varifyToken, (req, res) => {
    console.log("you are in uploadImage Routes & req.body.decoded is:", req.body.decoded.email);
    admin_controller_1.uploadPicture(req, res);
});
/**
 * decode token.
 */
// router.get('/list', decodeToken, (req: Request, res: Response) => {
//     getAdminList(req, res);
// });
/**
 * get all userList.
 */
router.post('/userlist', (req, res) => {
    console.log("you are in userlist Admin routes");
    admin_controller_2.getAllUser(req, res);
});
/**
 * get all filtered userList.
 */
// router.post('/userfilterdata', (req: Request, res: Response) => {
//     // console.log("you are in userlist Admin routes");
//     getFilterUser(req, res);
// });
// router.post('/notify', (req: Request, res: Response) => {
// console.log("you are in userlist Admin routes");
//  notify(req, res);
// });
/**
 * get summary of user API.
 */
router.post('/summary', (req, res) => {
    console.log("you are in user_summary Admin routes");
    admin_controller_1.getUserSummary(req, res);
});
//  router.get('/filter',(req:Request,res:Response)=>{
//      console.log("you are in Adminlist Admin routes");
//      getAllAdmin(req,res);
//  });
/**
 * change password user API.
 */
router.put('/changePassword', (req, res) => {
    console.log("you are in change password Admin routes");
    admin_controller_2.changePassword(req, res);
});
/**
 * reste password user API.
 */
router.put('/resetPassword', (req, res) => {
    console.log("you are in reset password Admin routes");
    admin_controller_2.resetPassword(req, res);
});
/**
 * user bio status api.
 */
router.put('/userbio', (req, res) => {
    console.log("you are in user bio API routes");
    admin_controller_2.UpdateBio(req, res);
});
/**
 * Refresh token api.
 */
router.get('/refresh', (req, res, next) => {
    console.log("you are in refresh token Api Routes");
    permission_1.checkExpiry(req, res, next);
});
exports.default = router;
//# sourceMappingURL=admin.routes.js.map
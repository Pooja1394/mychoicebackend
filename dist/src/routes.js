"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRoutes_1 = __importDefault(require("./components/user/userRoutes"));
const admin_routes_1 = __importDefault(require("./components/admin/admin.routes"));
// import productRouters from "./components/products/productRouters";
const deliveryRoutes_1 = __importDefault(require("./components/delivery/deliveryRoutes"));
const supplierRouters_1 = __importDefault(require("./components/supplier/supplierRouters"));
const brandRouter_1 = __importDefault(require("./components/brands/brandRouter"));
const categoryRouters_1 = __importDefault(require("./components/category/categoryRouters"));
const productRouters_1 = __importDefault(require("./components/product/productRouters"));
const auctionRoutes_1 = __importDefault(require("./components/auction/auctionRoutes"));
const bankRoutes_1 = __importDefault(require("./components/bank/bankRoutes"));
const notifyRoutes_1 = __importDefault(require("./components/notification/notifyRoutes"));
const buyBidRoutes_1 = __importDefault(require("./components/bank/buyBidRoutes"));
const tradeoutRoute_1 = __importDefault(require("./components/tradeExchange/tradeoutRoute"));
const transferRoutes_1 = __importDefault(require("./components/bank/transferRoutes"));
const depositRoute_1 = __importDefault(require("./components/reports/depositRoute"));
// import paymentRoutes from "./components/bank/paymentRoutes";
const couponRoutes_1 = __importDefault(require("./components/coupon/couponRoutes"));
const permissionRoutes_1 = __importDefault(require("./components/permission/permissionRoutes"));
const settingRoutes_1 = __importDefault(require("./components/settings/settingRoutes"));
const packageRoute_1 = __importDefault(require("./components/review/packageRoute"));
const packagePermissionRoute_1 = __importDefault(require("./components/review/packagePermissionRoute"));
const reviewManagementRoute_1 = __importDefault(require("./components/review/reviewManagementRoute"));
const employeeRoutes_1 = __importDefault(require("./components/employee/employeeRoutes"));
const typeRoute_1 = __importDefault(require("./components/notification/typeRoute"));
const logRoute_1 = __importDefault(require("./components/log/logRoute"));
const userFeedbackRoute_1 = __importDefault(require("./components/review/userFeedbackRoute"));
const userString = "/user";
const adminString = "/admin";
const auctionString = "/auction";
const reportString = "/reports";
// const productString = "/products";
const exclString = "/delivery";
const tradeoutString = "/tradeout";
const supplierString = "/supplier";
const brandString = "/brands";
const cateString = "/category";
const productsString = "/products";
const bankStrings = "/bank";
const notifyStrings = "/notify";
const buyBankString = "/buybank";
const transferString = "/transfer";
const paymentString = "/payment";
const type = "/type";
const coupon = '/coupon';
const permission = '/permission';
const reviewString = "/review";
const reviewPackageString = '/reviewpermission';
const settingString = '/setting';
const reviewManagementString = '/managementReview';
const employeeString = "/employee";
const logsString = "/logs";
// export default ( app: any ) => {
// app.use( userRoute);}
exports.default = (app) => {
    app.use(userString, userRoutes_1.default);
    app.use(adminString, admin_routes_1.default);
    app.use(auctionString, auctionRoutes_1.default);
    app.use(settingString, settingRoutes_1.default);
    app.use(exclString, deliveryRoutes_1.default);
    app.use(supplierString, supplierRouters_1.default);
    app.use(brandString, brandRouter_1.default);
    app.use(cateString, categoryRouters_1.default);
    app.use(productsString, productRouters_1.default);
    app.use(bankStrings, bankRoutes_1.default);
    app.use(notifyStrings, notifyRoutes_1.default);
    app.use(buyBankString, buyBidRoutes_1.default);
    app.use(transferString, transferRoutes_1.default);
    app.use(tradeoutString, tradeoutRoute_1.default);
    app.use(type, typeRoute_1.default);
    // app.use(paymentString, paymentRoutes);
    app.use(coupon, couponRoutes_1.default);
    app.use(permission, permissionRoutes_1.default);
    app.use(reviewString, packageRoute_1.default);
    app.use(reviewPackageString, packagePermissionRoute_1.default);
    app.use(reviewManagementString, reviewManagementRoute_1.default);
    app.use(reviewManagementString, userFeedbackRoute_1.default);
    // app.use(tradeoutString, tradeoutRoute);
    app.use(employeeString, employeeRoutes_1.default);
    app.use(reportString, depositRoute_1.default);
    app.use(logsString, logRoute_1.default);
    // app.use( appointmentString, appointmentRoute);
    // app.use( consultancyString, consultancyRoute);
    // app.use( diagnosticString, diagnosticRoute);
    // app.use( doctorString, doctorRoute);
    // app.use( homeAppointmentString, homeAppointmentRoute);
    // app.use( nursingString, nursingRoute);
    // app.use( pharmacyString, pharmacyRoute);
    // app.use( reportString, reportRoute);
    // app.use( supportString, supportRoute);
    // app.use( logString, logRoute);
    // app.use( settingString, settingRoute);
    // app.use( notificationString, notificationRoute);
};
//# sourceMappingURL=routes.js.map
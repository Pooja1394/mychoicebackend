"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const auctionModel_1 = __importDefault(require("./auctionModel"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const async = __importStar(require("async"));
const productModels_1 = __importDefault(require("../product/productModels"));
const auctionBookmarkModel_1 = __importDefault(require("./auctionBookmarkModel"));
const auctionHistoryModel_1 = __importDefault(require("./auctionHistoryModel"));
const websocket_1 = require("../../socket/websocket");
const types_1 = require("../../socket/types");
const brandModel_1 = __importDefault(require("../brands/brandModel"));
const utility_1 = require("../util/utility");
const userModels_1 = __importDefault(require("../user/userModels"));
const updateAuctionTime = 59; // sec
class AuctionController {
    addAuction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ip = req.headers['x-forwarded-for'];
                const userIp = ip.split(",")[0];
                const adminData = yield admin_model_1.default.findOne({ email: req.body.decoded.email }, { password: 0 });
                async.forEach(req.body.products, (product, cb) => __awaiter(this, void 0, void 0, function* () {
                    const auction = new auctionModel_1.default({
                        startDate: moment_timezone_1.default(req.body.startDate).format(),
                        endDate: moment_timezone_1.default(req.body.endDate).format(),
                        type: req.body.type,
                        perUser: req.body.perUser,
                        promotion: req.body.promotion,
                        biddingLimit: req.body.biddingLimit,
                        retailPrice: req.body.retailPrice,
                        startPrice: req.body.startPrice,
                        endPrice: req.body.endPrice,
                        priceIncrement: req.body.priceIncrement,
                        latest: {
                            time: moment_timezone_1.default(req.body.startDate).utc().seconds(0).format(),
                            status: '',
                            user: '',
                        },
                        buyLimit: {
                            buyStatus: req.body.buyLimit,
                            from: req.body.from,
                            to: req.body.to
                        },
                        startPercent: req.body.startPercent,
                        stopPercent: req.body.stopPercent,
                        bidBack: {
                            backStatus: req.body.bidBack,
                            custom: req.body.custom
                        },
                        bidLimit: req.body.bidLimit,
                        stock: req.body.stock,
                        status: req.body.status,
                        products: product,
                        createdBy: {
                            userName: adminData.userName,
                            picture: adminData.picture,
                            ip: userIp,
                        },
                    });
                    yield auction.save((err, data) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            res.json({
                                err: err
                            });
                        }
                        else if (data) {
                            const obj = {
                                startDate: data.startDate,
                                endDate: data.endDate,
                                type: data.type,
                                perUser: data.perUser,
                                promotion: data.promotion,
                                biddingLimit: data.biddingLimit,
                                retailPrice: data.retailPrice,
                                startPrice: data.startPrice,
                                endPrice: data.endPrice,
                                priceIncrement: data.priceIncrement,
                                startPercent: data.startPercent,
                                stopPercent: data.stopPercent,
                                buyLimit: data.buyLimit,
                                bidBack: data.bidBack,
                                bidLimit: data.bidLimit,
                                stock: data.stock,
                                status: data.status,
                                products: product,
                                createdBy: data.createdBy
                            };
                        }
                        else {
                            res.status(406).json({
                                statusCode: 406,
                                msg: "fill all details correctly",
                            });
                        }
                    }));
                }), (err) => {
                });
                utility_1.sendToAllOnlineUsers(types_1.Types.AUCTION_CHANGE, '', '');
                res.status(200).json({
                    statusCode: 200,
                    msg: "Auction created!"
                });
            }
            catch (err) {
                res.status(500).json({
                    statusCode: 500,
                    msg: "Try Again!",
                });
            }
        });
    }
    removeAuction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const removeAuction = yield auctionModel_1.default.remove({ "_id": req.body.auctionId });
                utility_1.sendToAllOnlineUsers(types_1.Types.AUCTION_DELETE, { id: req.body.auctionId }, '');
                res.status(200).json({ success: "true", removeAuction });
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    }
    removeMultiple(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let removeMultiple;
                for (let i = 0; i < req.body.auctionId.length; i++) {
                    removeMultiple = yield auctionModel_1.default.remove({ "_id": req.body.auctionId[i] });
                }
                res.status(200).json({ success: "true", removeMultiple });
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    }
    duplicateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ip = req.headers['x-forwarded-for'];
                const userIp = ip.split(",")[0];
                const adminData = yield admin_model_1.default.findOne({ email: req.body.decoded.email }, { password: 0 });
                const duplicateProduct = yield auctionModel_1.default.findOne({ "_id": req.body.auctionId });
                if (duplicateProduct) {
                    const auction = new auctionModel_1.default({
                        startDate: moment_timezone_1.default(req.body.startDate).format(),
                        endDate: moment_timezone_1.default(req.body.endDate).format(),
                        type: duplicateProduct.type,
                        perUser: duplicateProduct.perUser,
                        promotion: duplicateProduct.promotion,
                        biddingLimit: duplicateProduct.biddingLimit,
                        retailPrice: duplicateProduct.retailPrice,
                        startPrice: duplicateProduct.startPrice,
                        endPrice: duplicateProduct.endPrice,
                        priceIncrement: duplicateProduct.priceIncrement,
                        buyLimit: duplicateProduct.buyLimit,
                        bidBack: duplicateProduct.bidBack,
                        bidLimit: duplicateProduct.bidLimit,
                        stock: duplicateProduct.stock,
                        status: duplicateProduct.status,
                        products: duplicateProduct.products,
                        createdBy: {
                            userName: adminData.userName,
                            picture: adminData.picture,
                            ip: userIp,
                        }
                    });
                    yield auction.save();
                    res.status(201).json({ success: "True", auction });
                }
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    }
    getAuction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let skip_Value;
            let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
            if (req.query.page != undefined && req.query.page > 1) {
                skip_Value = limitValue * (req.query.page - 1);
            }
            else {
                skip_Value = 0;
            }
            if (req.query.limit != undefined) {
                limitValue = parseInt(req.query.limit);
            }
            try {
                const auctionData = yield auctionModel_1.default.find({}).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
                const totalCount = yield auctionModel_1.default.count({});
                const totalPage = Math.ceil(totalCount / limitValue);
                if (Object.keys(auctionData).length > 0) {
                    res.status(200).json({ success: "true", auctionData, totalPage });
                }
                else {
                    res.status(200).json({ success: false, auctionData });
                }
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    }
    auctionList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let skip_Value;
            let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
            if (req.query.page != undefined && req.query.page > 1) {
                skip_Value = limitValue * (req.query.page - 1);
            }
            else {
                skip_Value = 0;
            }
            if (req.query.limit != undefined) {
                limitValue = parseInt(req.query.limit);
            }
            let condition = {};
            if (req.body.productName) {
                condition = {
                    "products.productName": new RegExp('^' + req.body.productName, "i"),
                };
            }
            if (req.body.retailPrice || req.body.retailPrice === 0) {
                let value = {};
                value = { $lte: req.body.retailPrice };
                condition.retailPrice = value;
            }
            if (req.body.startDate) {
                const searchDate = moment_timezone_1.default(req.body.startDate).format('YYYY-MM-DD') + "T00:00:00.000";
                const searchGtDate = moment_timezone_1.default(req.body.startDate).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
                let value = {};
                value = {
                    '$lt': searchGtDate,
                    '$gte': searchDate
                };
                condition.startDate = value;
            }
            if (req.body.endDate) {
                const searchDate = moment_timezone_1.default(req.body.endDate).format('YYYY-MM-DD') + "T00:00:00:000";
                const searchGtDate = moment_timezone_1.default(req.body.endDate).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00:000";
                let value = {};
                value = {
                    '$lt': searchGtDate,
                    '$gte': searchDate
                };
                condition.endDate = value;
            }
            if (req.body.currentBid || req.body.currentBid === 0) {
                let value = {};
                value = { $lte: req.body.currentBid };
                condition.currentBid = value;
            }
            if (req.body.controlBy == "All") {
                condition;
            }
            if (req.body.controlBy == "Half Price") {
                condition.promotion = req.body.controlBy;
            }
            if (req.body.controlBy == "Free") {
                condition.promotion = req.body.controlBy;
            }
            if (req.body.controlBy == "OPU") {
                condition.perUser = "Yes";
            }
            if (req.body.controlBy == "Penny") {
                condition.type = req.body.controlBy;
            }
            if (req.body.controlBy == "Beginner") {
                condition.type = req.body.controlBy;
            }
            if (req.body.controlBy || req.body.controlBy === 0) {
                let value = {};
                value = { $lte: req.body.controlBy };
                condition.retailPrice = value;
            }
            if (req.body.status == "true") {
                condition.status = true;
            }
            if (req.body.status == "All") {
                condition;
            }
            try {
                const auctionData = yield auctionModel_1.default.find(condition).sort({ createdAt: -1 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
                const totalCount = yield auctionModel_1.default.count(condition);
                const totalPage = Math.ceil(totalCount / limitValue);
                if (Object.keys(auctionData).length > 0) {
                    res.status(200).json({ success: "true", auctionData, totalPage });
                }
                else {
                    res.status(200).json({ success: false, auctionData });
                }
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    }
    getAuctionByObjectId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let objectId = req.query.id;
            try {
                const auctionData = yield auctionModel_1.default.findOne({ '_id': objectId });
                let productId = yield auctionData.products.productId;
                const productData = yield productModels_1.default.findOne({ '_id': productId });
                res.status(200).send({ auctionData, 'products': [productData] });
            }
            catch (err) {
                res.status(400).send("Invalid Auction'Id");
            }
        });
    }
    updateAuction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield auctionModel_1.default.findOneAndUpdate({ _id: req.body._id }, {
                    $set: {
                        startDate: moment_timezone_1.default(req.body.startDate).format(),
                        endDate: moment_timezone_1.default(req.body.endDate).format(),
                        type: req.body.type,
                        perUser: req.body.perUser,
                        promotion: req.body.promotion,
                        biddingLimit: req.body.biddingLimit,
                        retailPrice: req.body.retailPrice,
                        startPrice: req.body.startPrice,
                        endPrice: req.body.endPrice,
                        priceIncrement: req.body.priceIncrement,
                        winner: {
                            id: '',
                            price: '',
                        },
                        latest: {
                            time: moment_timezone_1.default(req.body.startDate).utc().format(),
                            status: '',
                            user: '',
                            price: 0,
                        },
                        buyLimit: {
                            buyStatus: req.body.buyLimit,
                            from: req.body.from,
                            to: req.body.to
                        },
                        startPercent: req.body.startPercent,
                        stopPercent: req.body.stopPercent,
                        bidBack: {
                            backStatus: req.body.bidBack,
                            custom: req.body.custom
                        },
                        bidLimit: req.body.bidLimit,
                        stock: req.body.stock,
                        status: req.body.status,
                    }
                }, { new: true }, (err, data) => {
                    if (data) {
                        const _result = data.toJSON();
                        const obj = {
                            startDate: _result.startDate,
                            endDate: _result.endDate,
                            type: _result.type,
                            perUser: _result.perUser,
                            promotion: _result.promotion,
                            biddingLimit: _result.biddingLimit,
                            retailPrice: _result.retailPrice,
                            startPrice: _result.startPrice,
                            endPrice: _result.endPrice,
                            priceIncrement: _result.priceIncrement,
                            buyLimit: _result.buyLimit,
                            startPercent: _result.startPercent,
                            stopPercent: _result.stopPercent,
                            bidBack: _result.bidBack,
                            bidLimit: _result.bidLimit,
                            stock: _result.stock,
                            status: _result.status,
                        };
                        utility_1.sendToAllOnlineUsers(types_1.Types.AUCTION_CHANGE, '', '');
                        res.status(200).json(obj);
                    }
                    else {
                        res.status(400).json({ msg: "Not updated" });
                    }
                });
            }
            catch (err) {
                console.log("Error Found");
                res.status(500).json(err);
            }
        });
    }
    getUpcomingActions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const auctions = yield auctionModel_1.default.find({ 'startDate': { "$gte": new Date() } }).skip((page - 1) * limit).limit(limit);
            let auctionWithProductBrandID = [];
            async.forEach(auctions, (item, cb) => __awaiter(this, void 0, void 0, function* () {
                let productData = yield productModels_1.default.findOne({ "_id": item.products.productId }).select(['brand.id']);
                let brandData;
                if (productData) {
                    brandData = yield brandModel_1.default.findOne({ "_id": productData.brand.id });
                }
                let item1 = item.toObject();
                item1.brand = {
                    name: brandData.brandNameEn,
                    image: brandData.image,
                };
                auctionWithProductBrandID.push(item1);
                cb();
            }), (err) => {
                res.status(200).json({ auctions: auctionWithProductBrandID, totalPage: utility_1.totalPageCount(auctionWithProductBrandID.length, limit) });
            });
            // res.status(200).json({ auctions: auctions, totalPage: auctions.length });
        });
    }
    getWinningActions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const auctions = yield auctionModel_1.default.find({ 'winner.id': { $ne: '' } }).skip((page - 1) * limit).limit(limit);
            let auctionWithProductBrandID = [];
            async.forEach(auctions, (item, cb) => __awaiter(this, void 0, void 0, function* () {
                let productData;
                let brandData;
                let latest = Object.assign({}, item.latest);
                if (item.latest.user) {
                    let user = yield userModels_1.default.findOne({ _id: item.latest.user });
                    latest.picture = user.picture;
                    latest.bio = user.bio;
                    latest.userName = user.userName;
                }
                productData = yield productModels_1.default.findOne({ _id: item.products.productId }).select(['brand.id']);
                brandData = yield brandModel_1.default.findOne({ "_id": productData.brand.id });
                let winnerData = yield userModels_1.default.findOne({ "_id": item.winner.id }).select(['firstName', 'picture']);
                let item1 = item.toObject();
                item1.brand = {
                    name: brandData.brandNameEn,
                    image: brandData.image,
                };
                item1.winner = {
                    id: winnerData._id,
                    name: winnerData.firstName,
                    picture: winnerData.picture,
                    price: item.winner.price
                };
                auctionWithProductBrandID.push(Object.assign({}, item1, { latest }));
                cb();
            }), (err) => {
                res.status(200).json({ auctions: auctionWithProductBrandID, totalPage: utility_1.totalPageCount(auctionWithProductBrandID.length, limit) });
            });
        });
    }
    applyBids(data, connectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            // async applyBids(req: Request, res: Response) {
            // let body = req.body;
            // const userData: any = await Users.findOne({ email: req.body.decoded.email });
            // let data={
            //     userId:userData._id,
            //     auctionId:body.auctionId,
            // }
            let userId = data.userId;
            if (userId && data.auctionId) {
                try {
                    let auctionData = yield auctionModel_1.default.findOne({ _id: data.auctionId });
                    let userData = yield userModels_1.default.findOne({ _id: userId });
                    let bidAmount = parseInt(auctionData.latest.price) + parseInt(auctionData.priceIncrement);
                    let isHistory = true;
                    if (!(auctionData.biddingLimit >= bidAmount)) {
                        let history = yield auctionHistoryModel_1.default.findOne({ auctionId: data.auctionId, userId: userId });
                        isHistory = history ? true : false;
                    }
                    if (isHistory) {
                        if (userData.balance >= bidAmount) {
                            let updateUser = yield userModels_1.default.update({ _id: userId }, { balance: (userData.balance - auctionData.priceIncrement) });
                            auctionModel_1.default.findOneAndUpdate({
                                $or: [
                                    {
                                        $and: [
                                            { '_id': data.auctionId },
                                            { 'latest.status': 'start' },
                                        ]
                                    },
                                    {
                                        $and: [
                                            { '_id': data.auctionId },
                                            { 'latest.status': 'restart' }
                                        ]
                                    }
                                ]
                            }, {
                                $set: {
                                    "latest": {
                                        "user": userId,
                                        "time": moment_timezone_1.default().format(),
                                        "price": bidAmount,
                                        "status": "restart",
                                    }
                                }
                            }, { new: true }, (err, data) => __awaiter(this, void 0, void 0, function* () {
                                if (data) {
                                    let saveAuctionHistory = new auctionHistoryModel_1.default({
                                        userId: userId,
                                        amount: data.latest.price,
                                        auctionId: data._id
                                    });
                                    saveAuctionHistory.save((err, data1) => __awaiter(this, void 0, void 0, function* () {
                                        console.log("data1=========>", data, '--', data1);
                                        let productData = yield productModels_1.default.findOne({ _id: data.products.productId }).select(['brand.id']);
                                        let brandData = yield brandModel_1.default.findOne({ "_id": productData.brand.id });
                                        let brand = {
                                            name: brandData.brandNameEn,
                                            image: brandData.image,
                                        };
                                        let latest = Object.assign({}, data.latest, { picture: userData.picture, bio: userData.bio, userName: userData.userName });
                                        let pastWinners = [];
                                        let bidders = [];
                                        let otherAuctions = yield auctionModel_1.default.find({ "products.productId": data.products.productId, 'winner.id': { $ne: '' } });
                                        let auctionHistory = yield auctionHistoryModel_1.default.find({ "auctionId": data._id }, { createdAt: 1, userId: 1, amount: 1, auctionId: 1 }).sort({ 'amount': 'asc' });
                                        async.forEach(auctionHistory, (auction, cb) => __awaiter(this, void 0, void 0, function* () {
                                            let userData = yield userModels_1.default.findOne({ "_id": auction.userId });
                                            yield bidders.push({
                                                'userName': userData.userName,
                                                'picture': userData.picture ? userData.picture : '',
                                                'bio': userData.bio,
                                                'bid-amount': auction.amount,
                                                'time': auction.createdAt,
                                            });
                                            cb();
                                        }), (err) => __awaiter(this, void 0, void 0, function* () {
                                            otherAuctions && async.forEach(otherAuctions, (auction, cb) => __awaiter(this, void 0, void 0, function* () {
                                                let winnerData = yield userModels_1.default.findOne({ _id: auction.winner.id });
                                                winnerData && pastWinners.push({
                                                    'userName': winnerData.userName,
                                                    'picture': winnerData.picture,
                                                    'bio': winnerData.bio,
                                                    'bid-amount': auction.latest.price,
                                                    'time': auction.latest.time,
                                                });
                                                cb();
                                            }), (err) => {
                                                bidders.sort(function (a, b) {
                                                    if (parseInt(a['bid-amount']) > parseInt(b['bid-amount']))
                                                        return -1;
                                                    if (parseInt(a['bid-amount']) < parseInt(b['bid-amount']))
                                                        return 1;
                                                    return 0;
                                                });
                                                utility_1.sendToAllOnlineUsers(types_1.Types.AUCTION_STATUS_CHANGE, {
                                                    'auctions': [Object.assign({}, data.toObject(), { latest,
                                                            brand, productImages: productData.image, 'userBalance': (userData.balance - auctionData.priceIncrement), 'pastWinners': pastWinners, 'bidders': bidders })],
                                                }, 'user');
                                            });
                                        }));
                                    }));
                                    // res.status(200).json({ success: data });
                                }
                                else {
                                    utility_1.sendToOnlineUsersByConnectionId(types_1.Types.APPLY_BIDS, { 'success': false }, connectionId);
                                    // res.status(200).json({ success: false });
                                }
                            }));
                        }
                        else {
                            utility_1.sendToOnlineUsersByConnectionId(types_1.Types.NO_BALANCE, { 'message': 'You have no sufficient balance!' }, connectionId);
                            // res.status(400).json({ 'message': 'You have no sufficient balance!' });
                        }
                    }
                    else {
                        utility_1.sendToOnlineUsersByConnectionId(types_1.Types.NO_BALANCE, { 'message': "You can't apply bids!" }, connectionId);
                        // res.status(400).json({ 'message': "You can't apply bids!" });
                    }
                }
                catch (err) {
                    utility_1.sendToOnlineUsersByConnectionId(types_1.Types.APPLY_BIDS, { 'err': 'Try Again' }, connectionId);
                    // res.status(400).json({'err':'Try Again'});
                }
            }
            else {
                utility_1.sendToOnlineUsersByConnectionId(types_1.Types.APPLY_BIDS, { 'err': 'Incomplete arguments' }, connectionId);
                // res.status(400).json({'err':'Invalid UserId'});
            }
        });
    }
    createAuctionBookmark(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userModels_1.default.findOne({ email: req.body.decoded.email });
                let userId = userData._id;
                let body = req.body;
                const bookmarks = yield auctionBookmarkModel_1.default.findOne({ userId: userId });
                if (userData.status) {
                    res.status(400).json({ "msg": "User locked!" });
                }
                else if (userData.suspend) {
                    res.status(401).json({ "msg": "User suspended!" });
                }
                else if (bookmarks) {
                    let key;
                    let isAuctionEXist = bookmarks.auctionIds.filter((item, count) => { key = count; return item == body.auctionId; });
                    if (isAuctionEXist.length > 0) {
                        let updateBookmarks = yield auctionBookmarkModel_1.default.updateOne({ userId: userId }, { $set: { auctionIds: bookmarks.auctionIds.splice(1, key) } });
                        updateBookmarks && res.status(200).json({ "isBookmark": false, "msg": "BookMarks Deleted!" });
                    }
                    else {
                        let updateBookmarks = yield auctionBookmarkModel_1.default.updateOne({ userId: userId }, { $set: { auctionIds: bookmarks.auctionIds.concat(body.auctionId) } });
                        updateBookmarks && res.status(200).json({ "isBookmark": true, "msg": "BookMarks Created!" });
                    }
                }
                else {
                    let saveAuctionBookMark = new auctionBookmarkModel_1.default({
                        userId: userId,
                        auctionIds: body.auctionId,
                    });
                    saveAuctionBookMark.save((err, data) => {
                        data && res.status(200).json({ "isBookmark": true, "msg": "BookMarks Created!" });
                    });
                }
            }
            catch (err) {
                res.status(400).json("Invalid Authentication!");
            }
        });
    }
    getAuctionBookmarkByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 10;
            try {
                const userData = yield userModels_1.default.findOne({ email: req.body.decoded.email });
                const bookmarks = yield auctionBookmarkModel_1.default.findOne({ userId: userData._id });
                if (bookmarks) {
                    let auctions = [];
                    async.forEach(bookmarks.auctionIds, (id, cb) => __awaiter(this, void 0, void 0, function* () {
                        let auction = yield auctionModel_1.default.findOne({
                            $or: [
                                {
                                    $and: [
                                        { '_id': id },
                                        { 'latest.status': 'start' }
                                    ]
                                },
                                {
                                    $and: [
                                        { '_id': id },
                                        { 'latest.status': 'restart' }
                                    ]
                                }
                            ]
                        });
                        if (auction) {
                            let latest = Object.assign({}, auction.latest);
                            if (auction.latest.user) {
                                let user = yield userModels_1.default.findOne({ _id: auction.latest.user });
                                latest.picture = user.picture;
                                latest.bio = user.bio;
                                latest.userName = user.userName;
                            }
                            let productData = yield productModels_1.default.findOne({ _id: auction.products.productId }).select(['brand.id']);
                            let brand = {};
                            if (productData && productData.brand) {
                                let brandData = (yield productData.brand) ? brandModel_1.default.findOne({ "_id": productData.brand.id }) : '';
                                brand.name = brandData.brandNameEn;
                                brand.image = brandData.image;
                            }
                            yield auctions.push({ auction, brand, latest });
                        }
                        cb();
                    }), (err) => {
                        res.status(200).json({ auctions: auctions.slice((page - 1) * limit, (page - 1) * limit + limit), totalPage: utility_1.totalPageCount(auctions.length, limit) });
                    });
                }
                else {
                    res.status(200).json({ auctions: [] });
                }
            }
            catch (err) {
                res.status(400).json({ data: "Invalid I'd" });
            }
        });
    }
    getProductDetail(auctionId, connectionId, UserId) {
        return __awaiter(this, void 0, void 0, function* () {
            let isBookmark = yield auctionBookmarkModel_1.default.findOne({ userId: UserId, auctionIds: auctionId });
            let auction = yield auctionModel_1.default.findOne({ _id: auctionId });
            let otherAuctions = yield auctionModel_1.default.find({ "products.productId": auction.products.productId, "winner.id": { $ne: '' } });
            let product = yield productModels_1.default.findOne({ _id: auction.products.productId });
            let brand = yield productModels_1.default.findOne({ _id: product.brand.id });
            let highestBidders = auction.latest.user ? yield userModels_1.default.findOne({ _id: auction.latest.user }, { 'createdAt': 1, 'userName': 1, 'bio': 1, 'picture': 1, 'township': 1, 'city': 1, 'state': 1, 'localadd': 1, }) : '';
            let pastWinners = [];
            let auctionHistory = yield auctionHistoryModel_1.default.find({ auctionId: auctionId, createdAt: { $gte: auction.startDate } }, { createdAt: 1, userId: 1, amount: 1, auctionId: 1 }).sort({ 'amount': 'asc' });
            let bidders = [];
            let latest = Object.assign({}, auction.latest);
            if (highestBidders) {
                latest.picture = highestBidders.picture;
                latest.bio = highestBidders.bio;
                latest.userName = highestBidders.userName;
            }
            async.forEach(auctionHistory, (auction, cb) => __awaiter(this, void 0, void 0, function* () {
                let userData = yield userModels_1.default.findOne({ "_id": auction.userId });
                yield bidders.push({
                    'userName': userData.userName,
                    'picture': userData.picture ? userData.picture : '',
                    'bio': userData.bio,
                    'bid-amount': auction.amount,
                    'time': auction.createdAt,
                });
                cb();
            }), (err) => __awaiter(this, void 0, void 0, function* () {
                otherAuctions && async.forEach(otherAuctions, (auction, cb) => __awaiter(this, void 0, void 0, function* () {
                    // if (auction.winner.id) {
                    let winnerData = yield userModels_1.default.findOne({ _id: auction.winner.id });
                    yield pastWinners.push({
                        'userName': winnerData.userName,
                        'picture': winnerData.picture,
                        'bio': winnerData.bio,
                        'bid-amount': auction.latest.price,
                        'time': auction.latest.time,
                    });
                    // }
                    cb();
                }), (err) => {
                    bidders.sort(function (a, b) {
                        if (parseInt(a['bid-amount']) > parseInt(b['bid-amount']))
                            return -1;
                        if (parseInt(a['bid-amount']) < parseInt(b['bid-amount']))
                            return 1;
                        return 0;
                    });
                    let data = {
                        "auction": Object.assign({}, auction.toObject(), { latest, 'isBookmark': isBookmark ? true : false, brand: {
                                name: brand ? brand.brandNameEn : '',
                                image: brand ? brand.image : '',
                            }, 'highestBidders': highestBidders, 'pastWinners': pastWinners, 'productDetail': product, 'bidders': bidders }),
                    };
                    utility_1.sendToOnlineUsersByConnectionId(types_1.Types.AUCTION_COMPLETE_DETAIL, { 'data': data }, connectionId);
                    // res.status(200).json({
                    //     "auction": data
                    // });
                });
            }));
        });
    }
    auctionBidders(auctionId, connectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            // async auctionBidders(req: Request, res: Response){
            //     let auctionId=req.body.auctionId;
            let auctionHistory = yield auctionHistoryModel_1.default.find({ "auctionId": auctionId }, { createdAt: 1, userId: 1, amount: 1, auctionId: 1 }).sort({ 'amount': 'asc' });
            let bidders = [];
            async.forEach(auctionHistory, (auction, cb) => __awaiter(this, void 0, void 0, function* () {
                let userData = yield userModels_1.default.findOne({ "_id": auction.userId });
                yield bidders.push(Object.assign({}, auction.toObject(), { user: {
                        name: userData.firstName,
                        picture: userData.picture,
                    } }));
                cb();
            }), (err) => __awaiter(this, void 0, void 0, function* () {
                // res.status(200).json({"biddersHistory":bidders});
                let respondToUser = yield websocket_1.onlineUser.filter((user) => user._id == connectionId);
                if (respondToUser.length > 0) {
                    async.forEach(respondToUser, (userSession) => {
                        userSession.ws.send(JSON.stringify({ 'type': types_1.Types.AUCTION_BIDDERS, 'biddersHistory': bidders }));
                    });
                }
            }));
        });
    }
    changesAuctionStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            let time = new Date(new Date().setMilliseconds(0)).toISOString();
            let timerLimit = new Date(new Date((new Date()).getTime() - (updateAuctionTime * 1000)).setMilliseconds(0)).toISOString();
            let auctionData = [];
            let startAuctions = yield auctionModel_1.default.find({ 'latest.time': time, 'latest.status': '' });
            let restartAuctions = yield auctionModel_1.default.find({ 'latest.time': timerLimit, 'latest.status': 'restart' });
            let timerUpdates = [];
            if (startAuctions.length > 0) {
                auctionData = [];
                async.forEach(startAuctions, (item, cb) => __awaiter(this, void 0, void 0, function* () {
                    const auctions = yield auctionModel_1.default.updateOne({ 'latest.time': time }, { $set: { 'latest.status': 'start', 'latest.price': item.startPrice } });
                    if (auctions) {
                        let productData = yield productModels_1.default.findOne({ _id: item.products.productId }).select(['brand.id']);
                        let brandData = yield brandModel_1.default.findOne({ "_id": productData.brand.id });
                        let newObj = item;
                        let brand = {
                            name: brandData.brandNameEn,
                            image: brandData.image,
                        };
                        newObj.brand = brand;
                        newObj.latest.status = 'start';
                        newObj.productImages = productData.image;
                        auctionData.push(newObj);
                    }
                    cb();
                }), (err) => __awaiter(this, void 0, void 0, function* () {
                    // const auctions: any = await Auction.update({ 'latest.time': time }, { $set: { 'latest.status': 'start' } }, { multi: true }, (err: any, data: any) => {
                    //     if (err) throw err;
                    utility_1.sendToAllOnlineUsers(types_1.Types.AUCTION_STATUS_START, { 'auctions': auctionData }, '');
                    // });
                }));
            }
            if (restartAuctions.length > 0) {
                auctionData = [];
                async.forEach(restartAuctions, (item, cb) => __awaiter(this, void 0, void 0, function* () {
                    if (item.latest.status = 'restart') {
                        let auction = yield auctionModel_1.default.updateOne({ '_id': item._id }, { $set: { 'latest.status': 'close', 'winner.id': item.latest.user, 'winner.amount': item.latest.price } });
                        let auctionAmount = item.latest.price;
                        let usersBids = yield auctionHistoryModel_1.default.find({
                            $and: [
                                {
                                    startDate: { $lte: new Date(item.startDate) }
                                }, {
                                    endDate: { $gte: new Date() }
                                }, {
                                    userId: item.latest.user
                                }, {
                                    auctionId: item._id
                                }
                            ]
                        });
                        auctionAmount = auctionAmount - (usersBids.length * item.priceIncrement);
                        if (item.promotion == 'Free') {
                            auctionAmount = 0;
                        }
                        else if (item.promotion == 'Half Price') {
                            auctionAmount = item.latest.price / 2;
                        }
                        let user = yield userModels_1.default.findOneAndUpdate({ _id: item.latest.user }, { $set: { $inc: { balance: -auctionAmount } } });
                        let productData = yield productModels_1.default.findOne({ _id: item.products.productId }).select(['brand.id']);
                        let brandData = yield brandModel_1.default.findOne({ "_id": productData.brand.id });
                        let newObj = item;
                        newObj.latest.status = 'close';
                        newObj.productImages = productData.image;
                        newObj.latest.picture = user.picture;
                        newObj.latest.userName = user.userName;
                        newObj.latest.bio = user.bio;
                        newObj.winner.id = item.latest.user;
                        newObj.winner.price = item.latest.price;
                        let brand = {
                            name: brandData.brandNameEn,
                            image: brandData.image,
                        };
                        newObj.brand = brand;
                        auctionData.push(newObj);
                    }
                    cb();
                }), (err) => {
                    utility_1.sendToAllOnlineUsers(types_1.Types.AUCTION_STATUS_CLOSE, { 'auctions': auctionData }, '');
                });
            }
            let closeAuctions = yield auctionModel_1.default.find({ 'endDate': time, 'latest.status': 'start' });
            if (closeAuctions.length > 0) {
                auctionData = [];
                async.forEach(closeAuctions, (item, cb) => __awaiter(this, void 0, void 0, function* () {
                    let productData = yield productModels_1.default.findOne({ _id: item.products.productId }).select(['brand.id']);
                    let brandData = yield brandModel_1.default.findOne({ "_id": productData.brand.id });
                    let newObj = item;
                    newObj.productImages = productData.image;
                    let brand = {
                        name: brandData.brandNameEn,
                        image: brandData.image,
                    };
                    newObj.brand = brand;
                    newObj.latest.status = 'close';
                    auctionData.push(newObj);
                    cb();
                }), (err) => __awaiter(this, void 0, void 0, function* () {
                    const auctions = yield auctionModel_1.default.update({ 'endDate': time, 'latest.status': 'start' }, { $set: { 'latest.status': 'close' } }, { multi: true }, (err, data) => {
                        if (err)
                            throw err;
                        utility_1.sendToAllOnlineUsers(types_1.Types.AUCTION_STATUS_CLOSE, { 'auctions': auctionData }, '');
                    });
                }));
            }
            restartAuctions = yield auctionModel_1.default.find({ 'latest.status': 'restart' });
            async.forEach(restartAuctions, (item, cb) => __awaiter(this, void 0, void 0, function* () {
                let time = (new Date().getTime() - new Date(item.latest.time).getTime()) / 1000;
                timerUpdates.push({
                    _id: item._id,
                    time: (parseInt(updateAuctionTime) - (Math.floor(time))).toString()
                });
                cb();
            }), (err) => {
                utility_1.sendToAllOnlineUsers(types_1.Types.AUCTION_TIMER_UPDATE, { 'timerUpdate': timerUpdates }, '');
            });
        });
    }
    getOpeningActions(data, connectionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = data.page ? parseInt(data.page) : 1;
            let limit = data.limit ? parseInt(data.limit) : 10;
            let userData = yield userModels_1.default.findOne({ _id: userId });
            let auctions = yield auctionModel_1.default.find({ $or: [{ "latest.status": 'start' }, { "latest.status": 'restart' }] }, { createdAt: 1, userId: 1, amount: 1, auctionId: 1 });
            let openingActions = [];
            async.forEach(auctions, (id, cb) => __awaiter(this, void 0, void 0, function* () {
                let auction = yield auctionModel_1.default.findOne({ '_id': id });
                let productData = yield productModels_1.default.findOne({ _id: auction.products.productId }).select(['brand.id']);
                let brandData = yield brandModel_1.default.findOne({ "_id": productData.brand.id });
                let latest = Object.assign({}, auction.latest);
                if (auction.latest.user) {
                    let user = yield userModels_1.default.findOne({ _id: auction.latest.user });
                    latest.picture = user.picture;
                    latest.bio = user.bio;
                    latest.userName = user.userName;
                }
                let brand = {
                    name: brandData.brandNameEn,
                    image: brandData.image,
                };
                yield openingActions.push(Object.assign({}, auction.toObject(), { productImages: productData.image, brand, latest, isAccessible: (userData.level == auction.type) }));
                cb();
            }), (err) => __awaiter(this, void 0, void 0, function* () {
                let respondToUser = yield websocket_1.onlineUser.filter((user) => user._id == connectionId);
                if (respondToUser.length > 0) {
                    async.forEach(respondToUser, (userSession) => {
                        userSession.ws.send(JSON.stringify({
                            'type': types_1.Types.GET_OPENING_AUCTIONS,
                            'auctions': openingActions.slice((page - 1) * limit, (page - 1) * limit + limit),
                            'totalPage': utility_1.totalPageCount(openingActions.length, limit)
                        }));
                    });
                }
                // res.status(200).json({ auctions: openingActions.slice((page - 1) * limit, (page - 1) * limit + limit), totalPage: totalPageCount(openingActions.length, limit) });
            }));
        });
    }
}
exports.default = AuctionController;
//# sourceMappingURL=auctionController.js.map
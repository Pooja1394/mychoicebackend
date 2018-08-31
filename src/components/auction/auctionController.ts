import Auction from "./auctionModel";
import Admin from "../admin/admin.model";
import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from "jsonwebtoken";
import moment from "moment-timezone";
import * as async from "async";
import { request } from "http";
import { create } from "domain";
import decoded from 'jwt-decode';
import Product from '../product/productModels';
import AuctionBookmarks from './auctionBookmarkModel';
import AuctionHistory from './auctionHistoryModel';
import { onlineUser } from '../../socket/websocket';
import { Types } from '../../socket/types';
import Brand from '../brands/brandModel';
import { totalPageCount, sendToAllOnlineUsers, sendToOnlineUsersByConnectionId } from '../util/utility';
import Users from '../user/userModels';
const updateAuctionTime: any = 59; // sec

export default class AuctionController {
    async addAuction(req: Request, res: Response) {
        try {
            const ip: any = req.headers['x-forwarded-for'];
            const userIp: any = ip.split(",")[0];
            const adminData: any = await Admin.findOne({ email: req.body.decoded.email }, { password: 0 });
            async.forEach(req.body.products, async (product, cb) => {
                const auction = new Auction({
                    startDate: moment(req.body.startDate).format(),
                    endDate: moment(req.body.endDate).format(),
                    type: req.body.type,
                    perUser: req.body.perUser,
                    promotion: req.body.promotion,
                    biddingLimit: req.body.biddingLimit,
                    retailPrice: req.body.retailPrice,
                    startPrice: req.body.startPrice,
                    endPrice: req.body.endPrice,
                    priceIncrement: req.body.priceIncrement,
                    latest: {
                        time: moment(req.body.startDate).utc().seconds(0).format(),
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
                await auction.save(async (err: any, data: any) => {
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
                });
            }, (err: any) => {
            });
            sendToAllOnlineUsers(Types.AUCTION_CHANGE, '', '');
            res.status(200).json({
                statusCode: 200,
                msg: "Auction created!"
            });
        } catch (err) {
            res.status(500).json({
                statusCode: 500,
                msg: "Try Again!",
            });
        }
    }
    async removeAuction(req: Request, res: Response) {
        try {
            const removeAuction = await Auction.remove({ "_id": req.body.auctionId });
            sendToAllOnlineUsers(Types.AUCTION_DELETE, { id: req.body.auctionId }, '');
            res.status(200).json({ success: "true", removeAuction });
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    async removeMultiple(req: Request, res: Response) {
        try {
            let removeMultiple: any;
            for (let i = 0; i < req.body.auctionId.length; i++) {
                removeMultiple = await Auction.remove({ "_id": req.body.auctionId[i] });
            }
            res.status(200).json({ success: "true", removeMultiple });
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    async duplicateProduct(req: Request, res: Response) {
        try {
            const ip: any = req.headers['x-forwarded-for'];
            const userIp: any = ip.split(",")[0];
            const adminData: any = await Admin.findOne({ email: req.body.decoded.email }, { password: 0 });
            const duplicateProduct: any = await Auction.findOne({ "_id": req.body.auctionId });
            if (duplicateProduct) {
                const auction = new Auction({
                    startDate: moment(req.body.startDate).format(),
                    endDate: moment(req.body.endDate).format(),
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
                await auction.save();
                res.status(201).json({ success: "True", auction });
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    async getAuction(req: Request, res: Response) {
        let skip_Value;
        let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
        if (req.query.page != undefined && req.query.page > 1) {
            skip_Value = limitValue * (req.query.page - 1);
        } else { skip_Value = 0; }
        if (req.query.limit != undefined) {
            limitValue = parseInt(req.query.limit);
        }
        try {
            const auctionData = await Auction.find({}).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
            const totalCount = await Auction.count({});
            const totalPage = Math.ceil(totalCount / limitValue);
            if (Object.keys(auctionData).length > 0) {
                res.status(200).json({ success: "true", auctionData, totalPage });
            } else {
                res.status(200).json({ success: false, auctionData });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
    async auctionList(req: Request, res: Response) {
        let skip_Value;
        let limitValue = req.query.limit ? parseInt(req.query.limit) : 10;
        if (req.query.page != undefined && req.query.page > 1) {
            skip_Value = limitValue * (req.query.page - 1);
        } else { skip_Value = 0; }
        if (req.query.limit != undefined) {
            limitValue = parseInt(req.query.limit);
        }
        let condition: any = {};
        if (req.body.productName) {
            condition = {
                "products.productName": new RegExp('^' + req.body.productName, "i"),
            };
        }
        if (req.body.retailPrice || req.body.retailPrice === 0) {
            let value: any = {};
            value = { $lte: req.body.retailPrice };
            condition.retailPrice = value;
        }
        if (req.body.startDate) {
            const searchDate = moment(req.body.startDate).format('YYYY-MM-DD') + "T00:00:00.000";
            const searchGtDate = moment(req.body.startDate).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00.000";
            let value: any = {};
            value = {
                '$lt': searchGtDate,
                '$gte': searchDate
            };
            condition.startDate = value;
        }
        if (req.body.endDate) {
            const searchDate = moment(req.body.endDate).format('YYYY-MM-DD') + "T00:00:00:000";
            const searchGtDate = moment(req.body.endDate).add(1, 'd').format('YYYY-MM-DD') + "T00:00:00:000";
            let value: any = {};
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
            const auctionData = await Auction.find(condition).sort({ createdAt: -1 }).sort({ createdAt: -1 }).skip(skip_Value).limit(limitValue);
            const totalCount = await Auction.count(condition);
            const totalPage = Math.ceil(totalCount / limitValue);
            if (Object.keys(auctionData).length > 0) {
                res.status(200).json({ success: "true", auctionData, totalPage });
            } else {
                res.status(200).json({ success: false, auctionData });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
    async getAuctionByObjectId(req: Request, res: Response) {
        let objectId = req.query.id;
        try {
            const auctionData: any = await Auction.findOne({ '_id': objectId });
            let productId: any = await auctionData.products.productId;
            const productData = await Product.findOne({ '_id': productId });
            res.status(200).send({ auctionData, 'products': [productData] });
        } catch (err) {
            res.status(400).send("Invalid Auction'Id");
        }
    }
    async updateAuction(req: Request, res: Response) {
        try {
            await Auction.findOneAndUpdate({ _id: req.body._id },
                {
                    $set: {
                        startDate: moment(req.body.startDate).format(),
                        endDate: moment(req.body.endDate).format(),
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
                            time: moment(req.body.startDate).utc().format(),
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

                }, { new: true }, (err: any, data: any) => {
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
                        sendToAllOnlineUsers(Types.AUCTION_CHANGE, '', '');
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
    }
    async getUpcomingActions(req: Request, res: Response) {
        let page: any = req.query.page ? parseInt(req.query.page) : 1;
        let limit: any = req.query.limit ? parseInt(req.query.limit) : 10;
        const auctions: any = await Auction.find({ 'startDate': { "$gte": new Date() } }).skip((page - 1) * limit).limit(limit);
        let auctionWithProductBrandID: any = [];
        async.forEach(auctions, async (item: any, cb: any) => {
            let productData: any = await Product.findOne({ "_id": item.products.productId }).select(['brand.id']);
            let brandData: any;
            if (productData) {
                brandData = await Brand.findOne({ "_id": productData.brand.id });
            }
            let item1: any = item.toObject();
            item1.brand = {
                name: brandData.brandNameEn,
                image: brandData.image,
            };
            auctionWithProductBrandID.push(item1);
            cb();
        }, (err: any) => {
            res.status(200).json({ auctions: auctionWithProductBrandID, totalPage: totalPageCount(auctionWithProductBrandID.length, limit) });
        });
        // res.status(200).json({ auctions: auctions, totalPage: auctions.length });
    }
    async getWinningActions(req: Request, res: Response) {
        let page: any = req.query.page ? parseInt(req.query.page) : 1;
        let limit: any = req.query.limit ? parseInt(req.query.limit) : 10;
        const auctions: any = await Auction.find({ 'winner.id': { $ne: '' } }).skip((page - 1) * limit).limit(limit);
        let auctionWithProductBrandID: any = [];
        async.forEach(auctions, async (item: any, cb: any) => {
            let productData: any;
            let brandData: any;
            let latest: any = {
                ...item.latest
            };
            if (item.latest.user) {
                let user: any = await Users.findOne({ _id: item.latest.user });
                latest.picture = user.picture;
                latest.bio = user.bio;
                latest.userName = user.userName;
            }
            productData = await Product.findOne({ _id: item.products.productId }).select(['brand.id']);
            brandData = await Brand.findOne({ "_id": productData.brand.id });
            let winnerData: any = await Users.findOne({ "_id": item.winner.id }).select(['firstName', 'picture']);
            let item1: any = item.toObject();
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
            auctionWithProductBrandID.push({ ...item1, latest });
            cb();
        }, (err: any) => {
            res.status(200).json({ auctions: auctionWithProductBrandID, totalPage: totalPageCount(auctionWithProductBrandID.length, limit) });
        });
    }
    async applyBids(data: any, connectionId: any) {
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
                let auctionData: any = await Auction.findOne({ _id: data.auctionId });
                let userData: any = await Users.findOne({ _id: userId });
                let bidAmount: any = parseInt(auctionData.latest.price) + parseInt(auctionData.priceIncrement);
                let isHistory: any = true;
                if (!(auctionData.biddingLimit >= bidAmount)) {
                    let history = await AuctionHistory.findOne({ auctionId: data.auctionId, userId: userId });
                    isHistory = history ? true : false;
                }
                if (isHistory) {
                    if (userData.balance >= bidAmount) {
                        let updateUser = await Users.update({ _id: userId }, { balance: (userData.balance - auctionData.priceIncrement) });
                        Auction.findOneAndUpdate({
                            $or: [
                                {
                                    $and:
                                        [
                                            { '_id': data.auctionId },
                                            { 'latest.status': 'start' },
                                        ]
                                },
                                {
                                    $and:
                                        [
                                            { '_id': data.auctionId },
                                            { 'latest.status': 'restart' }
                                        ]
                                }
                            ]
                        }, {
                                $set: {
                                    "latest": {
                                        "user": userId,
                                        "time": moment().format(),
                                        "price": bidAmount,
                                        "status": "restart",
                                    }
                                }
                            }, { new: true }, async (err: any, data: any) => {
                                if (data) {
                                    let saveAuctionHistory = new AuctionHistory({
                                        userId: userId,
                                        amount: data.latest.price,
                                        auctionId: data._id
                                    });
                                    saveAuctionHistory.save(async (err: any, data1: any) => {
                                        console.log("data1=========>", data, '--', data1);
                                        let productData: any = await Product.findOne({ _id: data.products.productId }).select(['brand.id']);
                                        let brandData: any = await Brand.findOne({ "_id": productData.brand.id });
                                        let brand = {
                                            name: brandData.brandNameEn,
                                            image: brandData.image,
                                        };
                                        let latest: any = {
                                            ...data.latest,
                                            picture: userData.picture,
                                            bio: userData.bio,
                                            userName: userData.userName,

                                        };
                                        let pastWinners: any = [];
                                        let bidders: any = [];
                                        let otherAuctions: any = await Auction.find({ "products.productId": data.products.productId, 'winner.id': { $ne: '' } });
                                        let auctionHistory = await AuctionHistory.find({ "auctionId": data._id }, { createdAt: 1, userId: 1, amount: 1, auctionId: 1 }).sort({ 'amount': 'asc' });
                                        async.forEach(auctionHistory, async (auction: any, cb: any) => {
                                            let userData: any = await Users.findOne({ "_id": auction.userId });
                                            await bidders.push({
                                                'userName': userData.userName,
                                                'picture': userData.picture ? userData.picture : '',
                                                'bio': userData.bio,
                                                'bid-amount': auction.amount,
                                                'time': auction.createdAt,
                                            });
                                            cb();
                                        }, async (err: any) => {
                                            otherAuctions && async.forEach(otherAuctions, async (auction: any, cb: any) => {
                                                let winnerData: any = await Users.findOne({ _id: auction.winner.id });
                                                winnerData && pastWinners.push({
                                                    'userName': winnerData.userName,
                                                    'picture': winnerData.picture,
                                                    'bio': winnerData.bio,
                                                    'bid-amount': auction.latest.price,
                                                    'time': auction.latest.time,
                                                });
                                                cb();
                                            }, (err: any) => {
                                                bidders.sort(function (a: any, b: any) {
                                                    if (parseInt(a['bid-amount']) > parseInt(b['bid-amount'])) return -1;
                                                    if (parseInt(a['bid-amount']) < parseInt(b['bid-amount'])) return 1;
                                                    return 0;
                                                });
                                                sendToAllOnlineUsers(
                                                    Types.AUCTION_STATUS_CHANGE,
                                                    {
                                                        'auctions': [{
                                                            ...data.toObject(),
                                                            latest,
                                                            brand,
                                                            productImages: productData.image,
                                                            'userBalance': (userData.balance - auctionData.priceIncrement),
                                                            'pastWinners': pastWinners,
                                                            'bidders': bidders,
                                                        }],
                                                    },
                                                    'user'
                                                );
                                            });
                                        });
                                    });
                                    // res.status(200).json({ success: data });
                                } else {
                                    sendToOnlineUsersByConnectionId(
                                        Types.APPLY_BIDS,
                                        { 'success': false },
                                        connectionId
                                    );
                                    // res.status(200).json({ success: false });
                                }
                            });
                    } else {
                        sendToOnlineUsersByConnectionId(
                            Types.NO_BALANCE,
                            { 'message': 'You have no sufficient balance!' },
                            connectionId
                        );
                        // res.status(400).json({ 'message': 'You have no sufficient balance!' });
                    }
                } else {
                    sendToOnlineUsersByConnectionId(
                        Types.NO_BALANCE,
                        { 'message': "You can't apply bids!" },
                        connectionId
                    );
                    // res.status(400).json({ 'message': "You can't apply bids!" });
                }
            } catch (err) {
                sendToOnlineUsersByConnectionId(
                    Types.APPLY_BIDS,
                    { 'err': 'Try Again' },
                    connectionId
                );
                // res.status(400).json({'err':'Try Again'});
            }
        } else {
            sendToOnlineUsersByConnectionId(
                Types.APPLY_BIDS,
                { 'err': 'Incomplete arguments' },
                connectionId
            );
            // res.status(400).json({'err':'Invalid UserId'});
        }
    }
    async createAuctionBookmark(req: Request, res: Response) {
        try {
            const userData: any = await Users.findOne({ email: req.body.decoded.email });
            let userId = userData._id;
            let body = req.body;
            const bookmarks: any = await AuctionBookmarks.findOne({ userId: userId });
            if (userData.status) {
                res.status(400).json({ "msg": "User locked!" });
            } else if (userData.suspend) {
                res.status(401).json({ "msg": "User suspended!" });
            } else if (bookmarks) {
                let key: any;
                let isAuctionEXist = bookmarks.auctionIds.filter((item: any, count: any) => { key = count; return item == body.auctionId; });
                if (isAuctionEXist.length > 0) {
                    let updateBookmarks = await AuctionBookmarks.updateOne({ userId: userId }, { $set: { auctionIds: bookmarks.auctionIds.splice(1, key) } });
                    updateBookmarks && res.status(200).json({ "isBookmark": false, "msg": "BookMarks Deleted!" });
                } else {
                    let updateBookmarks = await AuctionBookmarks.updateOne({ userId: userId }, { $set: { auctionIds: bookmarks.auctionIds.concat(body.auctionId) } });
                    updateBookmarks && res.status(200).json({ "isBookmark": true, "msg": "BookMarks Created!" });
                }
            } else {
                let saveAuctionBookMark = new AuctionBookmarks({
                    userId: userId,
                    auctionIds: body.auctionId,
                });
                saveAuctionBookMark.save((err: any, data: any) => {
                    data && res.status(200).json({ "isBookmark": true, "msg": "BookMarks Created!" });
                });
            }
        } catch (err) {
            res.status(400).json("Invalid Authentication!");
        }
    }
    async getAuctionBookmarkByUserId(req: Request, res: Response) {
        let page: any = req.query.page ? parseInt(req.query.page) : 1;
        let limit: any = req.query.limit ? parseInt(req.query.limit) : 10;
        try {
            const userData: any = await Users.findOne({ email: req.body.decoded.email });
            const bookmarks: any = await AuctionBookmarks.findOne({ userId: userData._id });
            if (bookmarks) {
                let auctions: any = [];
                async.forEach(bookmarks.auctionIds, async (id: any, cb: any) => {
                    let auction: any = await Auction.findOne({
                        $or: [
                            {
                                $and:
                                    [
                                        { '_id': id },
                                        { 'latest.status': 'start' }
                                    ]
                            },
                            {
                                $and:
                                    [
                                        { '_id': id },
                                        { 'latest.status': 'restart' }
                                    ]
                            }
                        ]
                    }
                    );
                    if (auction) {
                        let latest: any = {
                            ...auction.latest
                        };
                        if (auction.latest.user) {
                            let user: any = await Users.findOne({ _id: auction.latest.user });
                            latest.picture = user.picture;
                            latest.bio = user.bio;
                            latest.userName = user.userName;
                        }
                        let productData: any = await Product.findOne({ _id: auction.products.productId }).select(['brand.id']);
                        let brand: any = {};
                        if (productData && productData.brand) {
                            let brandData: any = await productData.brand ? Brand.findOne({ "_id": productData.brand.id }) : '';
                            brand.name = brandData.brandNameEn;
                            brand.image = brandData.image;
                        }
                        await auctions.push({ auction, brand, latest });
                    }
                    cb();
                }, (err: any) => {
                    res.status(200).json({ auctions: auctions.slice((page - 1) * limit, (page - 1) * limit + limit), totalPage: totalPageCount(auctions.length, limit) });
                });
            } else {
                res.status(200).json({ auctions: [] });
            }
        } catch (err) {
            res.status(400).json({ data: "Invalid I'd" });
        }
    }
    async getProductDetail(auctionId: any, connectionId: any, UserId: any) {
        let isBookmark: any = await AuctionBookmarks.findOne({ userId: UserId, auctionIds: auctionId });
        let auction: any = await Auction.findOne({ _id: auctionId });
        let otherAuctions: any = await Auction.find({ "products.productId": auction.products.productId, "winner.id": { $ne: '' } });
        let product: any = await Product.findOne({ _id: auction.products.productId });
        let brand: any = await Product.findOne({ _id: product.brand.id });
        let highestBidders: any = auction.latest.user ? await Users.findOne({ _id: auction.latest.user }, { 'createdAt': 1, 'userName': 1, 'bio': 1, 'picture': 1, 'township': 1, 'city': 1, 'state': 1, 'localadd': 1, }) : '';
        let pastWinners: any = [];

        let auctionHistory = await AuctionHistory.find({ auctionId: auctionId, createdAt: { $gte: auction.startDate } }, { createdAt: 1, userId: 1, amount: 1, auctionId: 1 }).sort({ 'amount': 'asc' });
        let bidders: any = [];
        let latest: any = {
            ...auction.latest
        };
        if (highestBidders) {
            latest.picture = highestBidders.picture;
            latest.bio = highestBidders.bio;
            latest.userName = highestBidders.userName;
        }
        async.forEach(auctionHistory, async (auction: any, cb: any) => {
            let userData: any = await Users.findOne({ "_id": auction.userId });
            await bidders.push({
                'userName': userData.userName,
                'picture': userData.picture ? userData.picture : '',
                'bio': userData.bio,
                'bid-amount': auction.amount,
                'time': auction.createdAt,
            });
            cb();
        }, async (err: any) => {
            otherAuctions && async.forEach(otherAuctions, async (auction: any, cb: any) => {
                // if (auction.winner.id) {
                let winnerData: any = await Users.findOne({ _id: auction.winner.id });
                await pastWinners.push({
                    'userName': winnerData.userName,
                    'picture': winnerData.picture,
                    'bio': winnerData.bio,
                    'bid-amount': auction.latest.price,
                    'time': auction.latest.time,
                });
                // }
                cb();
            }, (err: any) => {
                bidders.sort(function (a: any, b: any) {
                    if (parseInt(a['bid-amount']) > parseInt(b['bid-amount'])) return -1;
                    if (parseInt(a['bid-amount']) < parseInt(b['bid-amount'])) return 1;
                    return 0;
                });
                let data = {
                    "auction": {
                        ...auction.toObject(),
                        latest,
                        'isBookmark': isBookmark ? true : false,
                        brand: {
                            name: brand ? brand.brandNameEn : '',
                            image: brand ? brand.image : '',
                        },
                        'highestBidders': highestBidders,
                        'pastWinners': pastWinners,
                        'productDetail': product,
                        'bidders': bidders,
                    },
                };
                sendToOnlineUsersByConnectionId(
                    Types.AUCTION_COMPLETE_DETAIL,
                    { 'data': data },
                    connectionId
                );
                // res.status(200).json({
                //     "auction": data
                // });
            });
        });
    }
    async auctionBidders(auctionId: any, connectionId: any) {
        // async auctionBidders(req: Request, res: Response){
        //     let auctionId=req.body.auctionId;
        let auctionHistory = await AuctionHistory.find({ "auctionId": auctionId }, { createdAt: 1, userId: 1, amount: 1, auctionId: 1 }).sort({ 'amount': 'asc' });
        let bidders: any = [];
        async.forEach(auctionHistory, async (auction: any, cb: any) => {
            let userData: any = await Users.findOne({ "_id": auction.userId });
            await bidders.push({
                ...auction.toObject(),
                user: {
                    name: userData.firstName,
                    picture: userData.picture,
                }
            });
            cb();
        }, async (err: any) => {
            // res.status(200).json({"biddersHistory":bidders});
            let respondToUser = await onlineUser.filter((user: any) => user._id == connectionId);
            if (respondToUser.length > 0) {
                async.forEach(respondToUser, (userSession: any) => {
                    userSession.ws.send(JSON.stringify({ 'type': Types.AUCTION_BIDDERS, 'biddersHistory': bidders }));
                });
            }
        });
    }
    async changesAuctionStatus() {
        let time: any = new Date(new Date().setMilliseconds(0)).toISOString();
        let timerLimit: any = new Date(new Date((new Date()).getTime() - (updateAuctionTime * 1000)).setMilliseconds(0)).toISOString();
        let auctionData: any = [];
        let startAuctions = await Auction.find({ 'latest.time': time, 'latest.status': '' });
        let restartAuctions = await Auction.find({ 'latest.time': timerLimit, 'latest.status': 'restart' });
        let timerUpdates: any = [];
        if (startAuctions.length > 0) {
            auctionData = [];
            async.forEach(startAuctions, async (item: any, cb: any) => {
                const auctions: any = await Auction.updateOne({ 'latest.time': time }, { $set: { 'latest.status': 'start', 'latest.price': item.startPrice } });
                if (auctions) {
                    let productData: any = await Product.findOne({ _id: item.products.productId }).select(['brand.id']);
                    let brandData: any = await Brand.findOne({ "_id": productData.brand.id });
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
            }, async (err: any) => {
                // const auctions: any = await Auction.update({ 'latest.time': time }, { $set: { 'latest.status': 'start' } }, { multi: true }, (err: any, data: any) => {
                //     if (err) throw err;
                sendToAllOnlineUsers(
                    Types.AUCTION_STATUS_START,
                    { 'auctions': auctionData },
                    ''
                );
                // });
            });
        }
        if (restartAuctions.length > 0) {
            auctionData = [];
            async.forEach(restartAuctions, async (item: any, cb: any) => {
                if (item.latest.status = 'restart') {
                    let auction = await Auction.updateOne({ '_id': item._id }, { $set: { 'latest.status': 'close', 'winner.id': item.latest.user, 'winner.amount': item.latest.price } });
                    let auctionAmount: any = item.latest.price;
                    let usersBids = await AuctionHistory.find({
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
                    } else if (item.promotion == 'Half Price') {
                        auctionAmount = item.latest.price / 2;
                    }
                    let user: any = await Users.findOneAndUpdate({ _id: item.latest.user }, { $set: { $inc: { balance: -auctionAmount } } });
                    let productData: any = await Product.findOne({ _id: item.products.productId }).select(['brand.id']);
                    let brandData: any = await Brand.findOne({ "_id": productData.brand.id });
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
            }, (err: any) => {
                sendToAllOnlineUsers(
                    Types.AUCTION_STATUS_CLOSE,
                    { 'auctions': auctionData },
                    ''
                );
            });
        }
        let closeAuctions = await Auction.find({ 'endDate': time, 'latest.status': 'start' });
        if (closeAuctions.length > 0) {
            auctionData = [];
            async.forEach(closeAuctions, async (item: any, cb: any) => {
                let productData: any = await Product.findOne({ _id: item.products.productId }).select(['brand.id']);
                let brandData: any = await Brand.findOne({ "_id": productData.brand.id });
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
            }, async (err: any) => {
                const auctions: any = await Auction.update({ 'endDate': time, 'latest.status': 'start' }, { $set: { 'latest.status': 'close' } }, { multi: true }, (err: any, data: any) => {
                    if (err) throw err;
                    sendToAllOnlineUsers(
                        Types.AUCTION_STATUS_CLOSE,
                        { 'auctions': auctionData },
                        ''
                    );
                });
            });
        }
        restartAuctions = await Auction.find({ 'latest.status': 'restart' });
        async.forEach(restartAuctions, async (item: any, cb: any) => {
            let time = (new Date().getTime() - new Date(item.latest.time).getTime()) / 1000;
            timerUpdates.push({
                _id: item._id,
                time: (parseInt(updateAuctionTime) - (Math.floor(time))).toString()
            });
            cb();
        }, (err) => {
            sendToAllOnlineUsers(
                Types.AUCTION_TIMER_UPDATE,
                { 'timerUpdate': timerUpdates },
                ''
            );
        });
    }
    async getOpeningActions(data: any, connectionId: any, userId: any) {
        let page: any = data.page ? parseInt(data.page) : 1;
        let limit: any = data.limit ? parseInt(data.limit) : 10;
        let userData: any = await Users.findOne({ _id: userId });
        let auctions = await Auction.find({ $or: [{ "latest.status": 'start' }, { "latest.status": 'restart' }] }, { createdAt: 1, userId: 1, amount: 1, auctionId: 1 });
        let openingActions: any = [];
        async.forEach(auctions, async (id: any, cb: any) => {
            let auction: any = await Auction.findOne({ '_id': id });
            let productData: any = await Product.findOne({ _id: auction.products.productId }).select(['brand.id']);
            let brandData: any = await Brand.findOne({ "_id": productData.brand.id });
            let latest: any = {
                ...auction.latest
            };
            if (auction.latest.user) {
                let user: any = await Users.findOne({ _id: auction.latest.user });
                latest.picture = user.picture;
                latest.bio = user.bio;
                latest.userName = user.userName;
            }
            let brand = {
                name: brandData.brandNameEn,
                image: brandData.image,
            };
            await openingActions.push({ ...auction.toObject(), productImages: productData.image, brand, latest, isAccessible: (userData.level == auction.type) });
            cb();
        }, async (err: any) => {
            let respondToUser = await onlineUser.filter((user: any) => user._id == connectionId);
            if (respondToUser.length > 0) {
                async.forEach(respondToUser, (userSession: any) => {
                    userSession.ws.send(JSON.stringify({
                        'type': Types.GET_OPENING_AUCTIONS,
                        'auctions': openingActions.slice((page - 1) * limit, (page - 1) * limit + limit),
                        'totalPage': totalPageCount(openingActions.length, limit)
                    }));
                });
            }
            // res.status(200).json({ auctions: openingActions.slice((page - 1) * limit, (page - 1) * limit + limit), totalPage: totalPageCount(openingActions.length, limit) });
        });
    }
}

import jwt, { TokenExpiredError } from "jsonwebtoken";
import usermongo from "../user/userModels";
import { Response, Request, NextFunction } from "express";
import decoded from "jwt-decode";
import { any } from "async";
import { jwt_secret } from "../user/userControllers";
import { decode } from "utf8";


export const verifyToken: any = async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.headers.authorization ::", req.headers.authorization);
    const tkn: any = req.headers.authorization;
    if (tkn) {
        const dt1: any = tkn.split('Bearer');
        const encrypt: any = dt1[1];
        console.log("encrypt", encrypt);
        const token = encrypt.trim();
        if (token) {
            console.log("token");
            const result = await jwt.decode(token);
            console.log(result);
            if (result) {
                req.body.decoded = result;
                next();
            }
            else {
                return res.status(403).json({ msg: "Invalid token" });
            }
        }
    }
    else {
        return res.status(403).json({ msg: "Invalid token" });
    }
};
export const checkExpiry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decoded = await jwt.decode(req.body.token);
        console.log(decoded);
        const refreshToken = jwt.sign({ decoded }, jwt_secret, {
            algorithm: 'HS384',
            expiresIn: 36000,
            issuer: 'Yash'
        });
        res.status(200).json(
            {
                refreshToken,
                expiresIn: 36000,
                msg: 'token refreshed',
            });
    }
    catch (err) {
        res.status(400).json({ msg: err });
    }
};
export const getIp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // inside middleware handler
        // const clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1
        // res.json(clientIp);
        const ip: any = req.headers['x-forwarded-for'];
        //  var ip = req.headers["x-forwarded-for"];
        const userIp = ip.split(",")[0];
        req.body.ip = userIp;
        next();
        console.log("req------>", req);

    }
    catch (error) {
        console.log("Error Found");
        res.status(500).json(error);
    }

};
import jwt, { TokenExpiredError } from "jsonwebtoken";
import admin from "../admin/admin.model";
import { Response, Request, NextFunction } from "express";
import decoded from "jwt-decode";
import { any } from "async";
import { jwt_secret } from "../admin/admin.controller";
import { decode } from "utf8";
import constant from "../config/constant";


export const varifyToken: any = async (req: Request, res: Response, next: NextFunction) => {
    console.log("you are in ....varifyToken", req.headers.authorization);
    const tkn: any = req.headers.authorization;
    let token: any = "";
    if (tkn != "" && tkn != undefined) {
        const data: any = tkn.split('Bearer');
        const encrypt: any = data[1];
        // console.log("you are in verify Token encrypt", encrypt);
        if (encrypt)
            token = encrypt.trim();
        if (token) {
            try {
                // console.log("token is===>", token);
                const result: any = await jwt.decode(token);
                if (result) {
                    req.body.decoded = result;
                    console.log("result token is:", req.body.decoded, req.body.decoded._id);
                    next();
                }
                else {
                    return res.status(403).json({ msg: "Invalid token" });
                }
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            return res.status(403).json({ msg: "Token not valid" });
        }
    }
    else {
        return res.status(403).json({ msg: "Token not provided" });
    }
};

export const checkExpiry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: any = req.headers.authorization;
        // console.log("token under checkexpiry", token);
        if (token != '' && token != undefined) {
            const decoded = await jwt.decode(token);
            console.log('decoded token is===>', decoded);
            const refreshToken = jwt.sign({ decoded }, jwt_secret, {
                algorithm: 'HS384',
                expiresIn: constant.expiresIn,
                issuer: 'Vivek'
            });
            res.status(200).json(
                {
                    refreshToken,
                    expiresIn: constant.expiresIn - 86400,
                    msg: 'token refreshed',
                });
        }
        else {
            res.status(403).json('Token not Provided');
        }
    }
    catch (err) {
        res.status(400).json({ msg: err });
    }
};

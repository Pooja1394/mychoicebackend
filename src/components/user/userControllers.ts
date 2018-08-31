import express from "express";
import usermongo from "./userModels";
import bcrypt from "bcryptjs";
import axios from "axios";
const requestIp = require("request-ip");
import fs from "fs";
import decoded from "jwt-decode";
import multer from "multer";
import moment from "moment-timezone";
import base64 from "base-64";
import utf8 from "utf8";
import product from "../product/productModels";
import supplier from "../supplier/supplierModels";
import category from "../category/categoryModels";
import brand from "../brands/brandModel";
import { createToken } from "../util";
import path from "path";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import async, { log } from "async";
export const jwt_secret = "ADIOS AMIGOS";
const app = express();
// const download = require('picture-downloader');
const download = require("image-downloader");
import { Response, Request, NextFunction } from "express";
import { json, raw } from "body-parser";
import constant from "../config/constant";
import en from "../../../language/en";
import my from "../../../language/my";
import { Types } from "../../socket/types";
import { onlineUser } from "../../socket/websocket";

export const register: any = (req: Request, res: Response) => {
  console.log("Signup ", req.body);
  if (
    req.body.firstName &&
    req.body.lastName &&
    req.body.userName &&
    req.body.email &&
    req.body.password
  ) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    if (req.body.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      usermongo.findOne({ email: req.body.email }, (err, result: any) => {
        console.log("result ---->", result);
        if (err) {
          res.status(500).json(err);
        } else if (result) {
          res.status(400).json({
            msg: "User Already exist"
          });
        } else {
          console.log("req.-------->", req.body);
          req.body.lastLogin = moment().format();
          const user = new usermongo(req.body);
          user.save(async (err, result) => {
            if (err) {
              console.log("err=", err);
              res.json({
                err: err
              });
            } else if (result) {
              try {
                const payload = {
                  email: result.toJSON().email,
                  _id: result.toJSON()._id,
                  userName: result.toJSON().userName
                };
                const token = await createToken(payload, constant.expiresIn);
                // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                // console.log("ip------> " + ip);
                const _result = result.toJSON();

                const obj = {
                  _id: _result._id,
                  firstName: _result.firstName,
                  lastName: _result.lastName,
                  userName: _result.userName,
                  email: _result.email,
                  suspend: _result.suspend,
                  status: _result.status,
                  isEnabled: _result.isEnabled,
                  createdBy: _result.createdBy,
                  createdAt: _result.createdAt,
                  updatedAt: _result.updatedAt,
                  token: token,
                  balance: _result.balance,
                  expiresIn: constant.expiresIn - 86400,
                  level: _result.level,
                  loginType: _result.loginType,
                  lastLogin: moment().format(),
                  picture:
                    "http://apimychoice.sia.co.in/public/pictures/" +
                    _result.picture,
                  bio: "",
                  localadd: "",
                  state: "",
                  city: "",
                  township: "",
                  lang: _result.lang,
                  amount: _result.amount,
                  msg: _result.lang == "en" ? en.registerok : my.registerok
                };
                let respondToUser = await onlineUser.filter((user: any) => (user.type == 'admin'));
                if (respondToUser.length > 0) {
                  async.forEach(respondToUser, (userSession: any) => {
                    userSession.ws.send(JSON.stringify({ 'type': Types.CREATE_NEW_USER, 'user': obj }));
                  });
                }
                res.status(200).json(obj);
              } catch (err) {
                res.status(400).json(err);
              }
            }
          });
        }
      });
    } else {
      res.status(406).json({
        statusCode: 406,
        msg: "fill email details correctley"
      });
    }
  } else {
    res.status(400).json({
      msg: "please fill all details first"
    });
  }
};
export const login = (req: Request, res: Response) => {
  console.log("Login hited");
  if (req.body.userName && req.body.password) {
    const auth: any = req.headers.authorization;
    usermongo.findOneAndUpdate(
      { userName: req.body.userName },
      { $set: { lastLogin: moment().format() } },
      (err, result: any) => {
        console.log(result);
        if (err) {
          res.status(500).json(err);
        } else if (result) {
          console.log("ids", result._id);
          const num_attempt = parseInt(req.body.attempt);
          if (num_attempt < 5) {
            if (result.status == false) {
              bcrypt.compare(
                req.body.password,
                result.toJSON().password,
                (err, data) => {
                  console.log("result" + data + err);
                  if (err) {
                    res.status(500).json(err);
                  }
                  if (data) {
                    // if (result.status == false) {
                    // post= db.post++;
                    const payload = {
                      email: result.toJSON().email,
                      _id: result.toJSON()._id
                    };
                    const token = jwt.sign(payload, jwt_secret, {
                      algorithm: "HS384",
                      expiresIn: constant.expiresIn,
                      issuer: "Yash"
                    });
                    const _result = result.toJSON();
                    const obj = {
                      _id: _result._id,
                      firstName: _result.firstName,
                      lastName: _result.lastName,
                      userName: _result.userName,
                      email: _result.email,
                      suspend: _result.suspend,
                      status: _result.status,
                      isEnabled: _result.isEnabled,
                      createdBy: _result.createdBy,
                      createdAt: _result.createdAt,
                      updatedAt: _result.updatedAt,
                      balance: _result.balance,
                      token: token,
                      expiresIn: constant.expiresIn - 86400,
                      ipAddress: req.body.ip,
                      level: _result.level,
                      loginType: _result.loginType,
                      lastLogin: _result.lastLogin,
                      is_reset: _result.is_reset,
                      bio: _result.bio,
                      localadd: _result.localadd,
                      state: _result.state,
                      city: _result.city,
                      township: _result.township,
                      amount: _result.amount,
                      picture: constant.url + _result.picture,
                      lang: _result.lang,
                      msg: "User Signed In"
                    };
                    res.json(obj);
                    // // }
                    // else {
                    // }
                  } else {
                    res.status(400).json({
                      msg: "wrong password"
                    });
                  }
                }
              );
            } else {
              res.status(401).json({
                msg: "Your Account Is Blocked"
              });
            }
          } else {
            usermongo.updateOne(
              { userName: req.body.userName },
              { $set: { status: true, suspend: true } },
              (err, data) => {
                if (err) throw err;
                res.status(401).json({
                  msg: "Your account is blocked"
                });
              }
            );
          }
        } else {
          res.status(400).json({
            msg: "User Not Found!"
          });
        }
      }
    );
  } else {
    console.log("m out username");
    res.status(400).json({
      // msg: "userName not registered"
      msg: "Invalid parameters!"
    });
  }
};
export const updatebio = async (req: Request, res: Response) => {
  if (req.body.bio) {
    //  const hii: any = req.body;
    //  console.log(`user:----${hii}`);
    try {
      await usermongo.findOneAndUpdate(
        { email: req.body.decoded.email },
        { $set: { bio: req.body.bio } },
        { new: true },
        (err, data: any) => {
          console.log(`user:----`, err);

          if (data) {
            if (data.status == false) {
              if (data.suspend == false) {
                const _result = data.toJSON();
                const obj = {
                  firstName: _result.firstName,
                  lastName: _result.lastName,
                  userName: _result.userName,
                  email: _result.email,
                  suspend: _result.suspend,
                  status: _result.status,
                  isEnabled: _result.isEnabled,
                  createdBy: _result.createdBy,
                  createdAt: _result.createdAt,
                  updatedAt: _result.updatedAt,
                  balance: _result.balance,
                  level: _result.level,
                  loginType: _result.loginType,
                  msg: "BIO UPDATED",
                  bio: req.body.bio
                };
                res.json(obj);
              } else {
                res.status(400).json({ msg: "Your account is Suspended" });
              }
            } else {
              res.status(401).json({ msg: "Your account is Blocked" });
            }
          } else {
            res.status(400).json({ msg: "data not found" });
          }
        }
      );
    } catch (error) {
      console.log("Error Found");
      res.status(400).json(error);
    }
  }
};
export const address = async (req: Request, res: Response) => {
  console.log("userName = ", req.body.userName);
  try {
    await usermongo.findOneAndUpdate(
      { email: req.body.decoded.email },
      {
        $set: {
          localadd: req.body.localadd,
          state: req.body.state,
          city: req.body.city,
          township: req.body.township
        }
      },
      { new: true },
      (err, data: any) => {
        console.log(`user:----`, data);

        if (data) {
          if (data.status == false) {
            if (data.suspend == false) {
              const _result = data.toJSON();
              const obj = {
                firstName: _result.firstName,
                lastName: _result.lastName,
                userName: _result.userName,
                email: _result.email,
                suspend: _result.suspend,
                status: _result.status,
                isEnabled: _result.isEnabled,
                createdBy: _result.createdBy,
                createdAt: _result.createdAt,
                updatedAt: _result.updatedAt,
                balance: _result.balance,
                level: _result.level,
                loginType: _result.loginType,
                bio: req.body.bio,
                address: req.body.address,

                msg: "ADDRESS UPDATED"
              };

              res.json(obj);
            } else {
              res.status(400).json({ msg: "Your account is Suspended" });
            }
          } else {
            res.status(401).json({ msg: "Your account is Blocked" });
          }
        } else {
          res.status(400).json("data not found");
        }
      }
    );
  } catch (error) {
    console.log("Error Found");
    res.status(400).json(error);
  }
};
export const newPass = async (req: Request, res: Response) => {
  console.log("my newpass api called!");
  try {
    const data: any = await usermongo.findOne({
      email: req.body.decoded.email
    });
    console.log("data of update password : ", data);
    bcrypt.compare(req.body.password, data.password, async (err, result) => {
      console.log("result ==>" + result + data.password);
      if (result) {
        if (data.status == false) {
          if (data.suspend == false) {
            console.log("result found");
            const newPassword = await bcrypt.hashSync(req.body.newPassword, 10);
            console.log("data-------> " + data.toJSON().password);
            usermongo.updateOne(
              { email: req.body.decoded.email },
              { $set: { password: newPassword } },
              (err, data) => {
                if (err) throw err;
                else
                  res.status(200).json({
                    msg: "Password successfuly change"
                  });
              }
            );
          } else {
            res.status(400).json({ msg: "Your account is Suspended" });
          }
        } else {
          res.status(401).json({ msg: "Your account is Blocked" });
        }
      } else {
        console.log("result not found");
        res.status(400).json({
          msg: "Current Password Does not match"
        });
      }
    });
  } catch (error) {
    // console.log("Error Found");
    res.status(400).json(error);
  }
};
export const forgotPassword = async (req: Request, res: Response) => {
  //  if (req.body.forgotPassword) {
  console.log("Entering" + req.body.decoded);
  try {
    console.log("hey all");
    await usermongo.findOne(
      { userName: req.body.userName },
      (err, data: any) => {
        console.log(`user:----`, err + data);
        if (data) {
          if (data.status == false) {
            if (data.suspend == false) {
              res.status(200).json({
                msg: "Please contact admin to update your Password"
              });
            } else {
              res.status(400).json({ msg: "Your account is Suspended" });
            }
          } else {
            res.status(401).json({ msg: "Your account is Blocked" });
          }
        } else {
          res.status(400).json({ msg: "Username Not found" });
        }
      }
    );
  } catch (error) {
    res.status(400).json(error);
  }
};
export const socialLogin = async (req: Request, res: Response) => {
  console.log(`user----`, req.connection.remoteAddress);
  if (req.body.access_token && req.body.is_Facebook) {
    console.log("fb running");
    try {
      const url = `https://graph.facebook.com/me?fields=id,name,first_name,last_name,email,picture.type(large)&access_token=${
        req.body.access_token
        }`;
      const fb = await axios.get(url);

      usermongo.findOne(
        {
          email: fb.data.email
        },
        (err, user: any) => {
          console.log("userdb---", user);
          if (err) {
            res.status(500).json(err);
          } else if (user) {
            if (user.status == false) {
              console.log("in else user");
              const payload = {
                email: user.email,
                _id: user._id
              };
              const token = jwt.sign(payload, jwt_secret, {
                algorithm: "HS384",
                expiresIn: constant.expiresIn,
                issuer: "Yash"
              });
              const picture: any = {
                url: fb.data.picture.data.url,
                dest: "./src/public/images/" + user._id + ".jpg"
              };
              console.log("picture", user._id, fb.data.picture.data.url);
              download
                .image(picture)
                .then(({ filename, image }: any) => {
                  console.log("File saved to", filename);
                })
                .catch((err: any) => {
                  throw err;
                });
              const data = {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                picture: constant.url + user._id + ".jpg",
                firstName: user.firstName,
                lastName: user.lastName,
                // isFacebook: true,
                loginType: "Facebook",
                suspend: user.suspend,
                status: user.status,
                isEnabled: user.isEnabled,
                createdBy: user.createdBy,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                localadd: user.localadd,
                state: user.state,
                city: user.city,
                township: user.township,
                balance: user.balance,
                level: user.level,
                token: token,
                expiresIn: constant.expiresIn - 86400,
                msg: "Already  Registered "
              };
              // res.json(data);
              console.log("response data ", data);
              res.status(201).json(data);
              // res.status(201).json({ err: "already exist you can directly login" })
            } else {
              res.status(401).json({
                msg: "You account is blocked"
              });
            }
          } else {
            console.log("in else fb save");
            const payload = {
              email: fb.data.email,
              _id: fb.data._id
            };
            const token = jwt.sign(payload, jwt_secret, {
              algorithm: "HS384",
              expiresIn: constant.expiresIn,
              issuer: "Yash"
            });
            const picture: any = {
              url: fb.data.picture.data.url,
              dest: "./src/public/images/" + fb.data.id + ".jpg"
            };
            // console.log("picture", user._id, fb.data.picture.data.url);
            download
              .image(picture)
              .then(({ filename, image }: any) => {
                console.log("File saved to", filename);
              })
              .catch((err: any) => {
                throw err;
              });
            console.log("fb data----->", fb.data);
            const obj = {
              // id: fb.data.id,
              userName: fb.data.name,
              email: fb.data.email,
              picture: constant.url + fb.data.id + ".jpg",
              firstName: fb.data.first_name,
              lastName: fb.data.last_name,
              isFacebook: true,
              loginType: "Facebook",
              suspend: fb.data.suspend,
              status: fb.data.status,
              isEnabled: fb.data.isEnabled,
              localadd: fb.data.localadd,
              state: fb.data.state,
              city: fb.data.city,
              township: fb.data.township,
              createdBy: fb.data.createdBy,
              createdAt: fb.data.createdAt,
              updatedAt: fb.data.updatedAt,
              balance: fb.data.balance,
              level: fb.data.level,
              msg: "User Signed In"
            };

            const userSave = new usermongo(obj);
            // console.log("user------>", obj)
            userSave.save((err, user_data: any) => {
              // console.log('in save db', user_data)
              if (err) {
                res.status(400).json(err);
              } else if (user_data) {
                // console.log( user_data);
                const data = {
                  _id: user_data._id,
                  userName: user_data.userName,
                  email: user_data.email,
                  picture: user_data.picture,
                  firstName: user_data.firstName,
                  lastName: user_data.lastName,
                  // isFacebook: true,
                  loginType: "Facebook",
                  suspend: user_data.suspend,
                  status: user_data.status,
                  isEnabled: user_data.isEnabled,
                  createdBy: user_data.createdBy,
                  createdAt: user_data.createdAt,
                  updatedAt: user_data.updatedAt,
                  localadd: user_data.localadd,
                  state: user_data.state,
                  city: user_data.city,
                  township: user_data.township,
                  balance: user_data.balance,
                  level: user_data.level,
                  token: token,
                  expiresIn: constant.expiresIn - 86400,
                  msg: "Sccuessfully Registered "
                };
                res.json(data);
                // res.status(200).json(data);
              } else {
                console.log("in else save");
                res.json({ msg: "in else", user_data });
              }
            });
          }
        }
      );
    } catch (error) {
      console.log("in catch");
      // console.log("Error",error);
      // res.json(error);
      res.status(400).json({ message: "invalid value" });
    }
  } else {
    console.log("google running");
    try {
      console.log("entering try");
      const url =
        "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" +
        req.body.access_token;
      console.log("gmail");
      const gmail = await axios.get(url);
      // console.log("gmail data", gmail.data);
      usermongo.findOne(
        {
          email: gmail.data.email
        },

        (err, user: any) => {
          console.log("userdb", user);
          if (err) {
            res.status(500).json(err);
          } else if (user) {
            if (user.status == false) {
              const payload = {
                email: user.email,
                _id: user._id
              };
              const token = jwt.sign(payload, jwt_secret, {
                algorithm: "HS384",
                expiresIn: constant.expiresIn,
                issuer: "Yash"
              });
              const picture: any = {
                url: gmail.data.picture,
                dest: "./src/public/images/" + user._id + ".jpg"
              };
              console.log("picture", user._id, gmail.data.picture);
              download
                .image(picture)
                .then(({ filename, image }: any) => {
                  console.log("File saved to", filename);
                })
                .catch((err: any) => {
                  throw err;
                });
              const data = {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                picture: constant.url + user._id + ".jpg",
                firstName: user.firstName,
                lastName: user.lastName,
                // isFacebook: false,
                loginType: "Google",
                suspend: user.suspend,
                status: user.status,
                isEnabled: user.isEnabled,
                createdBy: user.createdBy,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                balance: user.balance,
                bio: user.bio,
                localadd: user.localadd,
                state: user.state,
                city: user.city,
                township: user.township,
                level: user.level,
                token: token,
                expiresIn: constant.expiresIn - 86400,
                msg: "Already Registered "
              };
              res.status(200).json(data);

              // res.status(201).json({ err: "Already registered you can directly login" })
            } else {
              res.status(401).json({ msg: "Your account is blocked" });
            }
          } else {
            const payload = {
              email: gmail.data.email,
              _id: gmail.data._id
            };
            const token = jwt.sign(payload, jwt_secret, {
              algorithm: "HS384",
              expiresIn: constant.expiresIn,
              issuer: "Yash"
            });
            const picture: any = {
              url: gmail.data.picture,
              dest: "./src/public/images/" + gmail.data.id + ".jpg"
            };
            download
              .image(picture)
              .then(({ filename, image }: any) => {
                console.log("File saved to", filename);
              })
              .catch((err: any) => {
                throw err;
              });
            const obj = {
              // id: gmail.data.id,
              userName: gmail.data.name,
              email: gmail.data.email,
              picture: constant.url + gmail.data.id + ".jpg",
              firstName: gmail.data.given_name,
              lastName: gmail.data.family_name,
              isFacebook: true,
              loginType: "Google",
              suspend: gmail.data.suspend,
              status: gmail.data.status,
              isEnabled: gmail.data.isEnabled,
              bio: gmail.data.bio,
              localadd: gmail.data.localadd,
              state: gmail.data.state,
              city: gmail.data.city,
              township: gmail.data.township,
              createdBy: gmail.data.createdBy,
              createdAt: gmail.data.createdAt,
              updatedAt: gmail.data.updatedAt,
              balance: gmail.data.balance,
              level: gmail.data.level,
              msg: "User Signed In"
            };
            const userSave = new usermongo(obj);
            // console.log("user------>", obj)
            userSave.save((err, user_data: any) => {
              // console.log('in save db', user_data)
              if (err) {
                res.status(400).json(err);
              } else if (user_data) {
                // console.log( user_data);
                const data = {
                  _id: user_data.id,
                  userName: user_data.userName,
                  email: user_data.email,
                  picture: user_data.picture,
                  firstName: user_data.firstName,
                  lastName: user_data.lastName,
                  // isFacebook: false,
                  loginType: "Google",
                  suspend: user_data.suspend,
                  status: user_data.status,
                  isEnabled: user_data.isEnabled,
                  createdBy: user_data.createdBy,
                  createdAt: user_data.createdAt,
                  updatedAt: user_data.updatedAt,
                  bio: user_data.bio,
                  localadd: user_data.localadd,
                  state: user_data.state,
                  city: user_data.city,
                  township: user_data.township,
                  balance: user_data.balance,
                  level: user_data.level,
                  token: token,
                  expiresIn: constant.expiresIn - 86400,
                  msg: "Sccuessfully Registered "
                };
                res.status(200).json(data);
              } else {
                console.log("in else save");
                res.json({ msg: "in else", user_data });
              }
            });
          }
        }
      );
    } catch (error) {
      // console.log("Error",error);
      // res.json(error);
      res.status(400).json({ message: "invalid value" });
    }
  }
};
export const getBio = async (req: Request, res: Response) => {
  try {
    await usermongo.findOne(
      { email: req.body.decoded.email },
      (err, data: any) => {
        console.log(`user:----`, err, data);
        if (data) {
          const obj = {
            bio: data.bio,
            isEnabled: data.isEnabled
          };
          res.json(obj);
        } else {
          res.status(400).json("Cannot find Username with this token");
        }
      }
    );
  } catch (error) {
    console.log("Error Found");
    res.status(500).json(error);
  }
};
export const imgUpload = async (req: Request, res: Response) => {
  console.log("imgupload api called");
  try {
    console.log("File name===>", req.file.filename);
    usermongo.findOne({ email: req.body.decoded.email }, (err, data: any) => {
      console.log("userData====> ", data);
      if (data) {
        console.log("status---->" + data.status + data.suspend);
        if (data.status == false) {
          if (data.suspend == false) {
            usermongo.updateOne(
              { email: req.body.decoded.email },
              { $set: { picture: req.file.filename } },
              err => {
                res.status(200).json({
                  msg: data.lang == "en" ? en.picupload : my.picupload,
                  picture: constant.url + req.file.filename
                });
              }
            );
          } else {
            res.status(400).json({ msg: "Your account is Suspended" });
          }
        } else {
          res.status(401).json({ msg: "Your account is Blocked" });
        }
      } else {
        throw err;
      }
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(400).json(error);
  }
};
export const removepicture = async (req: Request, res: Response) => {
  const data: any = await usermongo.findById({ _id: req.body.decoded._id });
  if (data) {
    if (data.status == false) {
      if (data.suspend == false) {
        data.picture = "";
        await data.save();
        res.status(200).json({
          msg: data.lang == "en" ? en.picdelete : my.picdelete
        });
      } else {
        res.status(400).json({ msg: "Your account is Suspended" });
      }
    } else {
      res.status(401).json({ msg: "Your account is Blocked" });
    }
  } else {
    res.status(400).json({
      msg: "data not found"
    });
  }
};

export const getPicData = async (req: Request, res: Response) => {
  try {
    await usermongo.findOne(
      { email: req.body.decoded.email },
      (err, data: any) => {
        console.log(`user:----`, err, data);
        const status = data.status;
        if (data && status == false) {
          const obj = {
            picture: constant.url + data.picture
          };
          res.json(obj);
        } else if (status == true) {
          res.status(401).json({
            msg: data.lang == "en" ? en.statusblocked : my.statusblocked
          });
        } else {
          res.status(400).json({
            msg: "Cannot find Picture with this token"
          });
        }
      }
    );
  } catch (error) {
    console.log("Error Found");
    res.status(500).json(error);
  }
};
export const getIp = async (req: Request, res: Response) => {
  try {
    // inside middleware handler
    // const clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1
    // res.json(clientIp);
    const ip: any = req.headers["x-forwarded-for"];
    //  var ip = req.headers["x-forwarded-for"];
    const userIp = ip.split(",")[0];

    console.log("req------>", req);
    res.json(userIp);
  } catch (error) {
    console.log("Error Found");
    res.status(500).json(error);
  }
};
export const language = async (req: Request, res: Response) => {
  try {
    await usermongo.findOneAndUpdate(
      { email: req.body.decoded.email },
      { $set: { lang: req.body.lang } },
      { new: true },
      (err, data: any) => {
        console.log(`user:----`, err, data);
        const status = data.status;
        const suspend = data.suspend;
        if (data && status == false) {
          if (data && suspend == false) {
            const obj = {
              lang: req.body.lang
            };
            res.json({
              lang: data.lang,
              msg: req.body.lang == "en" ? en.lang : my.lang
            });
          } else if (suspend == true) {
            res.status(401).json({
              msg: data.lang == "en" ? en.suspendblocked : my.suspendblocked
            });
          }
        } else if (status == true) {
          res.status(401).json({
            msg: data.lang == "en" ? en.statusblocked : my.statusblocked
          });
        } else {
          res.status(400).json({
            msg: "Langauge not updated"
          });
        }
      }
    );
  } catch (error) {
    console.log("Error Found");
    res.status(500).json(error);
  }
};
export const resetPass = async (req: Request, res: Response) => {
  console.log("my newpass api called!");
  try {
    const data: any = await usermongo.findOne({ userName: req.body.userName });
    console.log("data of update password : ", data);
    if (data) {
      if (data.status == false) {
        if (data.suspend == false) {
          console.log("result found");
          const newPassword = await bcrypt.hashSync(req.body.newPassword, 10);
          console.log("data-------> " + data.toJSON().password);
          usermongo.updateOne(
            { userName: req.body.userName },
            { $set: { password: newPassword, is_reset: false } },
            (err, result) => {
              if (err) {
                throw err;
              } else
                res.status(200).json({
                  msg: data.lang == "en" ? en.passchng : my.passchng
                });
            }
          );
        } else {
          res.status(400).json({ msg: "Your account is Suspended" });
        }
      } else {
        res.status(401).json({ msg: "Your account is Blocked" });
      }
    } else {
      console.log("result not found");
      res.status(400).json({
        msg: "Cannot reset the password"
      });
    }
  } catch (error) {
    console.log("Error Found");
    res.status(500).json(error);
  }
};
export const updateamount = async (req: Request, res: Response) => {
  //  const hii: any = req.body;
  //  console.log(`user:----${hii}`);
  try {
    await usermongo.findOneAndUpdate(
      { email: req.body.email },
      { $set: { amount: req.body.amount } },
      { new: true },
      (err, data: any) => {
        console.log(`user:----`, err);

        if (data) {
          if (data.status == false) {
            if (data.suspend == false) {
              const _result = data.toJSON();
              const obj = {
                firstName: _result.firstName,
                lastName: _result.lastName,
                userName: _result.userName,
                email: _result.email,
                suspend: _result.suspend,
                status: _result.status,
                isEnabled: _result.isEnabled,
                createdBy: _result.createdBy,
                createdAt: _result.createdAt,
                updatedAt: _result.updatedAt,
                balance: _result.balance,
                level: _result.level,
                loginType: _result.loginType,
                amount: _result.amount
              };
              res.json(obj);
            } else {
              res.status(400).json({ msg: "Your account is Suspended" });
            }
          } else {
            res.status(401).json({ msg: "Your account is Blocked" });
          }
        } else {
          res.status(400).json({ msg: "data not found" });
        }
      }
    );
  } catch (error) {
    console.log("Error Found");
    res.status(400).json(error);
  }
};
export const gettrans = async (req: Request, res: Response) => {
  try {
    await usermongo.find({}, { _id: 1, balance: 1 }, (err, data: any) => {
      console.log(`user:----`, err, data);
      if (data) {
        res.json(data);
      } else {
        res.status(400).json(err);
      }
    });
  } catch (error) {
    console.log("Error Found");
    res.status(500).json(error);
  }
};
export let deleteimg = async (req: Request, res: Response) => {
  console.log("Inside delete", req.body);
  // console.log('m in Action of createbuybank', req.body.action);
  try {
    if (req.body.type == "product") {
      const productData: any = await product.findOne({ _id: req.body._id });
      // console.log('userData------userData', productData);
      productData.image.splice(req.body.index, 1);
      await productData.save();
      res.status(200).json({ msg: "Image Deleted Successfully" });
    } else if (req.body.type == "supplier") {
      const supplierData: any = await supplier.findOne({ _id: req.body._id });
      // console.log('Bank data====>', supplierData);
      const arr = supplierData.infoFile;
      console.log("arr-----", arr);
      arr.splice(req.body.index, 1);
      supplierData.infoFile = arr;

      // await supplierData.save()
      supplierData.save((err: any, data: any) => {
        res.status(200).json({ msg: "Image Deleted Successfully" });
      });
    } else if (req.body.type == "category") {
      const categoryData: any = await category.findOne({ _id: req.body._id });
      // console.log('*****biddata', categoryData);
      categoryData.image.splice(req.body.index, 1);
      await categoryData.save();
      res.status(200).json({ msg: "Image Deleted Successfully" });
    } else if (req.body.type == "brand") {
      const brandData: any = await brand.findOne({ _id: req.body._id });
      console.log("Bank data====>", brandData);
      const arr = brandData.infoFile;
      console.log("arr-----", arr);
      arr.splice(req.body.index, 1);
      brandData.infoFile = arr;

      // await brandData.save()
      brandData.save((err: any, data: any) => {
        res.status(200).json({ msg: "Image Deleted Successfully" });
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
export async function changeUserType() {
  let date = new Date();
  date.setMonth(date.getMonth() - 1);
  await usermongo.updateMany({ level: "Beginner", createdAt: { $lte: date.toISOString() } }, { level: 'Penny' });
}
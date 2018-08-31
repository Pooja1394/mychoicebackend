import express from 'express';
import bodyParser from 'body-parser';
import jsonwebtokens from 'jsonwebtoken';
import lodash from 'lodash';
import cors from "cors";
import path from "path";
import ejs from 'ejs';
import appRoutes from './routes';
import { Response, Request, NextFunction } from "express";
const mongoose = require('./database/mongoose');
const webSocket = require('./socket/websocket');
const crone = require('./crone/crone');
const app = express();


process.env.SECRET_KEY = 'ADIOS AMIGOS';

app.use(express.static("src"));
app.use(express.static("src/components/public/images"));
app.use(bodyParser.json());
app.use(cors());

app.set('port', (process.env.PORT || 5000));
const routes = appRoutes(app);

app.get("/index", (req: Request, res: Response) => {
  res.sendFile(__dirname + '/home.html');
});

app.get("/", (req: Request, res: Response) => {
  res.json('Hello MyChoice');
});
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log(req.body);
  next();
});

export default app;

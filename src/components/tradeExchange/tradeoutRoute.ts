import express from "express";
import {
  tradeoutCreate,
  filterTradeout,
  acceptTradeOut,
  paidTradeOut,
  buyTradeOut
} from "./tradeoutController";
import {
  tradeoutPaymentCreate,
  filterTradeoutPayment
} from "./tradeoutPaymentController";
import { tradeStatusCreate, filterTradeStatus } from "./tradeStatusController";
import { Request, Response } from "express";
import { verifyToken, checkExpiry } from "../util/auth";
import { verify } from "jsonwebtoken";
const router = express.Router();

router.post("/tradeoutCreate", verifyToken, (req: Request, res: Response) => {
  tradeoutCreate(req, res);
});

router.post("/filterTradeout", verifyToken, (req: Request, res: Response) => {
  filterTradeout(req, res);
});

router.put("/acceptTradeOut", verifyToken, (req: Request, res: Response) => {
  acceptTradeOut(req, res);
});

router.put("/paidTradeOut", verifyToken, (req: Request, res: Response) => {
  paidTradeOut(req, res);
});
router.put("/buyTradeOut", verifyToken, (req: Request, res: Response) => {
  buyTradeOut(req, res);
});

router.post(
  "/tradeoutPaymentCreate",
  verifyToken,
  (req: Request, res: Response) => {
    tradeoutPaymentCreate(req, res);
  }
);

router.post(
  "/filterTradeoutPayment",
  verifyToken,
  (req: Request, res: Response) => {
    filterTradeoutPayment(req, res);
  }
);

router.post(
  "/tradeStatusCreate",
  verifyToken,
  (req: Request, res: Response) => {
    tradeStatusCreate(req, res);
  }
);

router.post(
  "/filterTradeStatus",
  verifyToken,
  (req: Request, res: Response) => {
    filterTradeStatus(req, res);
  }
);
export default router;

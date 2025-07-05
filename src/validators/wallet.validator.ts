import { Request, Response, NextFunction } from "express";
import Joi from "joi"; 
import httpStatus from "http-status";
import { validatorWrapper } from "../utils/validator";

export default class WalletValidator {
  async createWalletValidator(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = Joi.object({
        name: Joi.string().trim().required(),
        balance: Joi.number().precision(4).min(0).required(),
      });
      req.body = validatorWrapper(schema, req.body);
      next();
    } catch (err: any) {
      res.status(httpStatus.BAD_REQUEST).json({
        status: false,
        message: err.message || "Invalid wallet data",
      });
    }
  }

  async transactValidator(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = Joi.object({
        amount: Joi.number().precision(4).required(),
        description: Joi.string().required(),
      });
      const paramsSchema = Joi.object({
        walletId: Joi.string().guid({ version: "uuidv4" }).required(),
      });

      req.body = validatorWrapper(bodySchema, req.body);
      req.params = validatorWrapper(paramsSchema, req.params);
      next();
    } catch (err: any) {
      res.status(httpStatus.BAD_REQUEST).json({
        status: false,
        message: err.message || "Invalid transaction input",
      });
    }
  }

  async getWalletValidator(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = Joi.object({
        walletId: Joi.string().guid({ version: "uuidv4" }).required(),
      });
      req.params = validatorWrapper(schema, req.params);
      next();
    } catch (err: any) {
      res.status(httpStatus.BAD_REQUEST).json({
        status: false,
        message: err.message || "Invalid wallet ID",
      });
    }
  }

  async getTransactionsValidator(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const schema = Joi.object({
        walletId: Joi.string().guid({ version: "uuidv4" }).required(),
        skip: Joi.number().integer().min(0).optional(),
        limit: Joi.number().integer().min(1).max(100).optional(),
      });
      req.query = validatorWrapper(schema, req.query);
      next();
    } catch (err: any) {
      res.status(httpStatus.BAD_REQUEST).json({
        status: false,
        message: err.message || "Invalid query params",
      });
    }
  }
}

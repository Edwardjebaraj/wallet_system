import { Request, Response } from "express";
import httpStatus from "http-status";
import { Transaction } from "sequelize";
import { getSequalizeClient, sequelizeClient } from "../db/database";
import WalletService from "../services/wallet.service";
import responseHandler from "../utils/responseHandler";

export default class WalletController {
  private walletService: WalletService;

  constructor() {
    this.walletService = new WalletService();
  }

  // 1. POST /setup - Create Wallet
  postWalletDetails = async (req: Request, res: Response) => {
    let transaction!: Transaction;
    try {
      await getSequalizeClient();
      console.log('name, balance');
      transaction = await sequelizeClient.transaction();

      const { name, balance } = req.body;



      const walletResponse = await this.walletService.createWallet(
        name,
        balance,
        transaction
      );

      if (!walletResponse.response.status) {
        await transaction.rollback();
        return res.status(httpStatus.BAD_REQUEST).send(walletResponse.response);
      }

      await transaction.commit();
      return res
        .status(walletResponse.response.code)
        .send(walletResponse.response);
    } catch (error) {
      console.error(`Controller Error in create:`, error);

      await transaction?.rollback();
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(
          responseHandler.returnError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Failed to create wallet"
          ).response
        );
    }
  };

  // 2. POST /transact/:walletId - Credit/Debit
  postTransaction = async (req: Request, res: Response) => {
    let transaction!: Transaction;
    try {
      await getSequalizeClient();
      transaction = await sequelizeClient.transaction();

      const { walletId } = req.params;
      const { amount, description } = req.body;

      const result = await this.walletService.transact(
        walletId,
        amount,
        description,
        transaction
      );

      if (!result.response.status) {
        await transaction.rollback();
        return res.status(httpStatus.BAD_REQUEST).send(result.response);
      }

      await transaction.commit();
      return res.status(result.response.code).send(result.response);
    } catch (err) {
      await transaction?.rollback();
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(
          responseHandler.returnError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Failed to process transaction"
          ).response
        );
    }
  };

  // 3. GET /wallet/:walletId - Fetch Wallet
  fetchWalletDetails = async (req: Request, res: Response) => {
    try {
      await getSequalizeClient();
      const { walletId } = req.params;

      const walletResponse = await this.walletService.getWalletById(walletId);

      return res
        .status(walletResponse.response.code)
        .send(walletResponse.response);
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(
          responseHandler.returnError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Failed to fetch wallet"
          ).response
        );
    }
  };

  // 4. GET /transactions - Fetch Wallet Transactions
  fetchTransactions = async (req: Request, res: Response) => {
    try {
      await getSequalizeClient();
      const { walletId, skip = 0, limit = 10 } = req.query;

      if (!walletId) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send(
            responseHandler.returnError(
              httpStatus.BAD_REQUEST,
              "Missing walletId"
            ).response
          );
      }

      const result = await this.walletService.getWalletTransactions(
        String(walletId),
        Number(skip),
        Number(limit)
      );

      return res.status(result.response.code).send(result.response);
    } catch (err) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(
          responseHandler.returnError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Failed to fetch transactions"
          ).response
        );
    }
  };
}

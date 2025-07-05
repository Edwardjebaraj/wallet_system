import httpStatus from "http-status";
import { Transaction } from "sequelize";

import SequalizeSuperDao from "../dao/sequalize/SuperDao.sequalize";
import { wallets } from "../models/sequalize/wallets";
import responseHandler from "../utils/responseHandler";
import { v4 as uuidv4 } from "uuid";
import { transactions } from "../models/sequalize/transactions";

// import _ from 'lodash';
export default class WalletService {
  constructor() {}

  async createWallet(name: string, balance: number, transaction: Transaction) {
    try {
      const walletId = uuidv4();

      const walletDao = new SequalizeSuperDao(wallets);
      const transactionDao = new SequalizeSuperDao(transactions);

      const newWallet = await walletDao.create(
        {
          id: walletId,
          name,
          balance: balance.toFixed(4),
        },
        transaction
      );
 

      await transactionDao.create(
        {
          id: uuidv4(),
          wallet_id: walletId,
          amount: balance.toFixed(4),
          balance: balance.toFixed(4),
          description: "Setup",
          type: "CREDIT",
        },
        transaction
      );

      return responseHandler.returnSuccess(httpStatus.OK, "Wallet created", {
        id: walletId,
        balance,
        name,
        transactionId: null,
        date: newWallet.createdAt,
      });
    } catch (e) {
      console.error("Create Wallet Error:", e);
      return responseHandler.returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create wallet"
      );
    }
  }

  async transact(
    walletId: string,
    amount: number,
    description: string,
    transaction: Transaction
  ) {
    try {
      const walletDao = new SequalizeSuperDao(wallets);
      const transactionDao = new SequalizeSuperDao(transactions); 

      const wallet = await walletDao.findOneByWhere(
        { id: walletId },
        transaction,
        [],
        transaction.LOCK.UPDATE
      ); 
      const currentBalance = parseFloat(wallet.balance.toString());
      const newBalance = parseFloat((currentBalance + amount).toFixed(4));

      if (newBalance < 0) {
        return responseHandler.returnError(
          httpStatus.BAD_REQUEST,
          "Insufficient balance"
        );
      }

      // Record transaction
      const txn = await transactionDao.create(
        {
          id: uuidv4(),
          wallet_id: walletId,
          amount: amount.toFixed(4),
          balance: newBalance.toFixed(4),
          description,
          type: amount > 0 ? "CREDIT" : "DEBIT",
        },
        transaction
      );

      // Update wallet balance
      const updateResponse = await walletDao.updateWhere(
        { balance: newBalance.toFixed(4) },
        { id: walletId },
        transaction
      );

      if (!txn || !updateResponse) {
        return responseHandler.returnError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Transaction failed"
        );
      }

      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Transaction successful",
        {
          transactionId: txn.id,
          balance: newBalance,
        }
      );
    } catch (err) {
      console.error("Transaction error:", err);
      return responseHandler.returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Transaction processing failed"
      );
    }
  }

  async getWalletById(walletId: string) {
    try {
      const walletDao = new SequalizeSuperDao(wallets);

        const wallet = await walletDao.findByWhere({ id: walletId });
        
        console.log(wallet,walletId);

      if (!wallet || wallet.length === 0) {
        return responseHandler.returnError(
          httpStatus.NOT_FOUND,
          "Wallet not found"
        );
      }

      const { id, balance, name, createdAt } = wallet[0];

      return responseHandler.returnSuccess(httpStatus.OK, "Wallet fetched", {
        id,
        balance: parseFloat(balance),
        name,
        date: createdAt,
      });
    } catch (err) {
      console.error("Get Wallet Error:", err);
      return responseHandler.returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to fetch wallet"
      );
    }
  }
  async getWalletTransactions(walletId: string, skip = 0, limit = 10) {
      try {
      const transactionDao = new SequalizeSuperDao(transactions);
        
      const transactionList = await transactionDao.findByWhere({ wallet_id: walletId },[],{
        order: [["date", "DESC"]],
        offset: skip,
        limit,
      });

      const result = transactionList.map((txn) => ({
        id: txn.id,
        walletId: txn.wallet_id,
        amount: parseFloat(txn.amount as string),
        balance: parseFloat(txn.balance as string),
        description: txn.description,
        date: txn.date,
        type: txn.type,
      }));

      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Transactions fetched",
        result
      );
    } catch (err) {
      console.error("Fetch Transactions Error:", err);
      return responseHandler.returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to fetch transactions"
      );
    }
  }
}

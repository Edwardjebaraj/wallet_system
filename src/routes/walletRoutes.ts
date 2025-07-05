import { Router } from "express";
import WalletController from "../controllers/wallet.controller";
import WalletValidator from "../validators/wallet.validator";

const router = Router();
const walletController = new WalletController();
const walletValidator = new WalletValidator();

router.post(
  "/setup",
  walletValidator.createWalletValidator,
  walletController.postWalletDetails
);
router.post(
  "/transact/:walletId",
  walletValidator.transactValidator,
  walletController.postTransaction
);
router.get(
  "/wallet/:walletId",
  walletValidator.getWalletValidator,
  walletController.fetchWalletDetails
);
router.get(
  "/transactions",
  walletValidator.getTransactionsValidator,
  walletController.fetchTransactions
);

export default router;

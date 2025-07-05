import type { Sequelize } from "sequelize";
import { transactions as _transactions } from "./transactions";
import type { transactionsAttributes, transactionsCreationAttributes } from "./transactions";
import { wallets as _wallets } from "./wallets";
import type { walletsAttributes, walletsCreationAttributes } from "./wallets";

export {
  _transactions as transactions,
  _wallets as wallets,
};

export type {
  transactionsAttributes,
  transactionsCreationAttributes,
  walletsAttributes,
  walletsCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const transactions = _transactions.initModel(sequelize);
  const wallets = _wallets.initModel(sequelize);

  transactions.belongsTo(wallets, { as: "wallet", foreignKey: "wallet_id"});
  wallets.hasMany(transactions, { as: "transactions", foreignKey: "wallet_id"});

  return {
    transactions: transactions,
    wallets: wallets,
  };
}

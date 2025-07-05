import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { wallets, walletsId } from './wallets';

export interface transactionsAttributes {
  id: string;
  wallet_id: string;
  amount: number;
  balance: number;
  description?: string;
  type: 'CREDIT' | 'DEBIT';
  date?: Date;
}

export type transactionsPk = "id";
export type transactionsId = transactions[transactionsPk];
export type transactionsOptionalAttributes = "description" | "date";
export type transactionsCreationAttributes = Optional<transactionsAttributes, transactionsOptionalAttributes>;

export class transactions extends Model<transactionsAttributes, transactionsCreationAttributes> implements transactionsAttributes {
  id!: string;
  wallet_id!: string;
  amount!: number;
  balance!: number;
  description?: string;
  type!: 'CREDIT' | 'DEBIT';
  date?: Date;

  // transactions belongsTo wallets via wallet_id
  wallet!: wallets;
  getWallet!: Sequelize.BelongsToGetAssociationMixin<wallets>;
  setWallet!: Sequelize.BelongsToSetAssociationMixin<wallets, walletsId>;
  createWallet!: Sequelize.BelongsToCreateAssociationMixin<wallets>;

  static initModel(sequelize: Sequelize.Sequelize): typeof transactions {
    return transactions.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    wallet_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'wallets',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: false
    },
    balance: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('CREDIT','DEBIT'),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'transactions',
    timestamps: false,underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_wallet_id",
        using: "BTREE",
        fields: [
          { name: "wallet_id" },
        ]
      },
      {
        name: "idx_wallet_id_date",
        using: "BTREE",
        fields: [
          { name: "wallet_id" },
          { name: "date" },
        ]
      },
      {
        name: "idx_type",
        using: "BTREE",
        fields: [
          { name: "type" },
        ]
      },
      {
        name: "idx_wallet_id_amount",
        using: "BTREE",
        fields: [
          { name: "wallet_id" },
          { name: "amount" },
        ]
      },
    ]
  });
  }
}

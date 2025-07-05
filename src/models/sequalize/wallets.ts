import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { transactions, transactionsId } from './transactions';

export interface walletsAttributes {
  id: string;
  name: string;
  balance: number;
  created_at?: Date;
  updated_at?: Date;
}

export type walletsPk = "id";
export type walletsId = wallets[walletsPk];
export type walletsOptionalAttributes = "balance" | "created_at" | "updated_at";
export type walletsCreationAttributes = Optional<walletsAttributes, walletsOptionalAttributes>;

export class wallets extends Model<walletsAttributes, walletsCreationAttributes> implements walletsAttributes {
  id!: string;
  name!: string;
  balance!: number;
  created_at?: Date;
  updated_at?: Date;

  // wallets hasMany transactions via wallet_id
  transactions!: transactions[];
  getTransactions!: Sequelize.HasManyGetAssociationsMixin<transactions>;
  setTransactions!: Sequelize.HasManySetAssociationsMixin<transactions, transactionsId>;
  addTransaction!: Sequelize.HasManyAddAssociationMixin<transactions, transactionsId>;
  addTransactions!: Sequelize.HasManyAddAssociationsMixin<transactions, transactionsId>;
  createTransaction!: Sequelize.HasManyCreateAssociationMixin<transactions>;
  removeTransaction!: Sequelize.HasManyRemoveAssociationMixin<transactions, transactionsId>;
  removeTransactions!: Sequelize.HasManyRemoveAssociationsMixin<transactions, transactionsId>;
  hasTransaction!: Sequelize.HasManyHasAssociationMixin<transactions, transactionsId>;
  hasTransactions!: Sequelize.HasManyHasAssociationsMixin<transactions, transactionsId>;
  countTransactions!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof wallets {
    return wallets.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    balance: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: false,
      defaultValue: 0.0000
    }
  }, {
    sequelize,
    tableName: 'wallets',
      timestamps: true,
      underscored: true,
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
        name: "idx_wallet_name",
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
  }
}

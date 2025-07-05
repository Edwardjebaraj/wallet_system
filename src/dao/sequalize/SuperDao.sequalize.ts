/* eslint-disable @typescript-eslint/no-explicit-any */
import { Includeable, WhereOptions } from "sequelize";

export default class SequalizeSuperDao {
  model: any;

  constructor(model: any) {
    this.model = model;
  }

  async create(data: any, transaction): Promise<any> {
    try {
      return await this.model.create(data, { transaction });
    } catch (err) {
      console.error(`DAO Error in create:`, err);
      throw err;
    }
  }

  async bulkCreate(data: object[], transaction): Promise<any> {
    try {
      return await this.model.bulkCreate(data, { transaction });
    } catch (err) {
      console.error(`DAO Error in bulkCreate:`, err);
      throw err;
    }
  }

  async updateWhere(
    data: object,
    where: WhereOptions,
    transaction
  ): Promise<any> {
    try {
      return await this.model.update(data, { where, transaction });
    } catch (err) {
      console.error(`DAO Error in updateWhere:`, err);
      throw err;
    }
  }

  async findByWhere(
    where: WhereOptions,
    include: Includeable[] = [],
    options: {
      order?: any[];
      offset?: number;
      limit?: number;
      transaction?: any;
    } = {}
  ): Promise<any> {
    try {
      const queryOptions: any = {
        where,
        include,
        ...options,
      };
       const result = await this.model.findAll(queryOptions); 
      return result.map((record) => {
        return record.toJSON();
      });
    } catch (err) {
      console.error(`DAO Error in findByWhere:`, err);
      throw err;
    }
  }

  async findOneByWhere(
    where: WhereOptions,
    transaction?: any,
    include: Includeable[] = [],
    lock?: any
  ): Promise<any> {
    try {
      const result = await this.model.findOne({
        where,
        include,
        transaction,
        lock,
      });
      return result.get({ plain: true });
    } catch (err) {
      console.error("DAO Error in findOneByWhere:", err);
      throw err;
    }
  }

  async deleteByWhere(where: WhereOptions, transaction): Promise<any> {
    try {
      return await this.model.destroy({ where, transaction });
    } catch (err) {
      console.error(`DAO Error in deleteByWhere:`, err);
      throw err;
    }
  }

  async getCountByWhere(where: WhereOptions): Promise<number> {
    try {
      return await this.model.count({ where });
    } catch (err) {
      console.error(`DAO Error in getCountByWhere:`, err);
      throw err;
    }
  }

  async isDataExists(where: WhereOptions): Promise<boolean> {
    try {
      const count = await this.model.count({ where });
      return count > 0;
    } catch (err) {
      console.error(`DAO Error in isDataExists:`, err);
      throw err;
    }
  }
}

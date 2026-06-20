const { User } = require('../models');
const { Op } = require('sequelize');
const { hashPassword } = require('../utils');

module.exports = {
  async list({ search, role, status, page, limit }) {
    try {
      const where = {};

      if (search) {
        where[Op.or] = [
          { name: { [Op.substring]: search } },
          { email: { [Op.substring]: search } },
        ];
      }
      if (role) where.role = role;
      if (status) where.status = status;

      const pageNum = page || 1;
      const limitNum = limit || 10;
      const offset = (pageNum - 1) * limitNum;

      const { count, rows } = await User.findAndCountAll({
        where,
        offset,
        limit: limitNum,
        attributes: { exclude: ['password'] },
      });

      return {
        users: rows,
        total: count,
        page: pageNum,
        totalPages: Math.ceil(count / limitNum),
      };
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
      });
      if (!user) {
        const e = new Error('User not found'); e.statusCode = 404; throw e;
      }
      return user;
    } catch (error) {
      throw error;
    }
  },

  async create(data) {
    try {
      const hashedPassword = await hashPassword(data.password);
      const user = await User.create({ ...data, password: hashedPassword });
      const { password, ...userData } = user.toJSON();
      return userData;
    } catch (error) {
      throw error;
    }
  },

  async update(id, data) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        const e = new Error('User not found'); e.statusCode = 404; throw e;
      }

      if (data.password) {
        data.password = await hashPassword(data.password);
      }

      await user.update(data);
      const { password, ...userData } = user.toJSON();
      return userData;
    } catch (error) {
      throw error;
    }
  },

  async remove(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        const e = new Error('User not found'); e.statusCode = 404; throw e;
      }
      await user.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  },
};

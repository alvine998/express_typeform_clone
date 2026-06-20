const { User } = require('../models');
const { generateToken, comparePassword } = require('../utils');

module.exports = {
  async login(email, password) {
    try {
      const user = await User.findOne({ where: { email, status: 'active' } });
      if (!user) {
        const err = new Error('Invalid credentials');
        err.statusCode = 401;
        throw err;
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        const err = new Error('Invalid credentials');
        err.statusCode = 401;
        throw err;
      }

      const token = generateToken({ id: user.id, role: user.role });

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          department: user.department,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  async getMe(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
      });
      if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }
      return user;
    } catch (error) {
      throw error;
    }
  },
};

const { Notification } = require('../models');
const { Op } = require('sequelize');

const list = async ({ userId, unread, page, limit } = {}) => {
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;
  const where = {};
  if (userId) where.user_id = userId;
  if (unread) where.read = false;

  const offset = (pageNum - 1) * limitNum;

  const { count, rows } = await Notification.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    offset,
    limit: limitNum,
  });

  return {
    notifications: rows,
    total: count,
    page: pageNum,
    totalPages: Math.ceil(count / limitNum),
  };
};

const markAsRead = async (id) => {
  const notification = await Notification.findByPk(id);
  if (!notification) {
    const err = new Error('Notification not found');
    err.statusCode = 404;
    throw err;
  }
  notification.read = true;
  await notification.save();
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.update(
    { read: true },
    { where: { user_id: userId, read: false } }
  );
};

module.exports = { list, markAsRead, markAllAsRead };

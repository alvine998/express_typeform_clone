const { ActivityLog } = require('../models');
const { Op } = require('sequelize');

const list = async ({ action, userId, page = 1, limit = 10 } = {}) => {
  const where = {};
  if (action) where.action = action;
  if (userId) where.user_id = userId;

  const offset = (page - 1) * limit;

  const { count, rows } = await ActivityLog.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    offset,
    limit,
  });

  return {
    logs: rows,
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
  };
};

const create = async ({ userId, userName, action, entity, entityId, details, ipAddress }) => {
  const log = await ActivityLog.create({
    user_id: userId,
    user_name: userName,
    action,
    entity,
    entity_id: entityId,
    details,
    ip_address: ipAddress,
  });

  return log;
};

module.exports = { list, create };

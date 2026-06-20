const activityLogsService = require('../services/activityLogs.service');
const { response200, response201, response400, response404, response500 } = require('../../utils/response');

const list = async (req, res, next) => {
  try {
    const { action, userId, page, limit } = req.query;
    const result = await activityLogsService.list({ action, userId, page, limit });
    return response200(res, result);
  } catch (err) {
    if (err.statusCode === 404) return response404(res, err.message);
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { action, entity, entityId, details } = req.body;
    const userId = req.user ? req.user.id : req.body.userId;
    const userName = req.user ? req.user.user_name : req.body.userName;
    const ipAddress = req.ip;

    const log = await activityLogsService.create({ userId, userName, action, entity, entityId, details, ipAddress });
    return response201(res, log);
  } catch (err) {
    if (err.statusCode === 404) return response404(res, err.message);
    next(err);
  }
};

module.exports = { list, create };

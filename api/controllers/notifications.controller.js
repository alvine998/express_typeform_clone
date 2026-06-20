const notificationsService = require('../services/notifications.service');
const { response200, response400, response404, response500 } = require('../../utils/response');

const list = async (req, res, next) => {
  try {
    const { unread, page, limit } = req.query;
    const userId = req.user.id;
    const result = await notificationsService.list({ userId, unread, limit });
    return response200(res, result);
  } catch (err) {
    if (err.statusCode === 404) return response404(res, err.message);
    next(err);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const result = await notificationsService.markAsRead(req.params.id);
    return response200(res, result);
  } catch (err) {
    if (err.statusCode === 404) return response404(res, err.message);
    next(err);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationsService.markAllAsRead(req.user.id);
    return response200(res, result);
  } catch (err) {
    if (err.statusCode === 404) return response404(res, err.message);
    next(err);
  }
};

module.exports = { list, markAsRead, markAllAsRead };

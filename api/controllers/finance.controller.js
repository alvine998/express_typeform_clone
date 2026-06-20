const financeService = require('../services/finance.service');
const { response200, response400, response404, response500 } = require('../../utils/response');

const list = async (req, res, next) => {
  try {
    const { status, category, page, limit } = req.query;
    const result = await financeService.list({ status, category, page, limit });
    return response200(res, result);
  } catch (err) {
    if (err.statusCode === 404) return response404(res, err.message);
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const result = await financeService.getById(req.params.id);
    return response200(res, result);
  } catch (err) {
    if (err.statusCode === 404) return response404(res, err.message);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await financeService.update(req.params.id, req.body);
    return response200(res, result);
  } catch (err) {
    if (err.statusCode === 404) return response404(res, err.message);
    next(err);
  }
};

const approve = async (req, res, next) => {
  try {
    const result = await financeService.approve(req.params.id, req.user.id);
    return response200(res, result);
  } catch (err) {
    if (err.statusCode === 404) return response404(res, err.message);
    next(err);
  }
};

const reject = async (req, res, next) => {
  try {
    const result = await financeService.reject(req.params.id, req.user.id);
    return response200(res, result);
  } catch (err) {
    if (err.statusCode === 404) return response404(res, err.message);
    next(err);
  }
};

module.exports = { list, getById, update, approve, reject };

const dashboardService = require('../services/dashboard.service');
const { response200, response400, response404, response500 } = require('../../utils/response');

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats();
    return response200(res, stats);
  } catch (err) {
    if (err.statusCode === 404) return response404(res, err.message);
    next(err);
  }
};

const getCharts = async (req, res, next) => {
  try {
    const charts = await dashboardService.getCharts();
    return response200(res, charts);
  } catch (err) {
    if (err.statusCode === 404) return response404(res, err.message);
    next(err);
  }
};

module.exports = { getStats, getCharts };

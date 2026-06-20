const { User, Form, FormResponse, ActivityLog } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const getStats = async () => {
  const [totalForms, totalResponses, totalUsers, activeSurveys] = await Promise.all([
    Form.count(),
    FormResponse.count(),
    User.count({ where: { status: 'active' } }),
    Form.count({ where: { status: 'active' } }),
  ]);

  const monthlyResponses = await FormResponse.findAll({
    attributes: [
      [fn('DATE_FORMAT', col('submitted_at'), '%Y-%m'), 'month'],
      [fn('COUNT', col('id')), 'count'],
    ],
    group: [fn('DATE_FORMAT', col('submitted_at'), '%Y-%m')],
    order: [[fn('DATE_FORMAT', col('submitted_at'), '%Y-%m'), 'ASC']],
    raw: true,
  });

  const responsesByForm = await FormResponse.findAll({
    attributes: [
      'form_id',
      [fn('COUNT', col('FormResponse.id')), 'count'],
    ],
    include: [{ model: Form, attributes: ['title'], as: 'form' }],
    group: ['form_id'],
  });

  const recentActivity = await ActivityLog.findAll({
    order: [['created_at', 'DESC']],
    limit: 10,
  });

  return {
    totalForms,
    totalResponses,
    totalUsers,
    activeSurveys,
    monthlyResponses,
    responsesByForm,
    recentActivity,
  };
};

const getCharts = async () => {
  const [responsesOverTime, formsByStatus] = await Promise.all([
    FormResponse.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('submitted_at'), '%Y-%m-%d'), 'date'],
        [fn('COUNT', col('id')), 'count'],
      ],
      group: [fn('DATE_FORMAT', col('submitted_at'), '%Y-%m-%d')],
      order: [[fn('DATE_FORMAT', col('submitted_at'), '%Y-%m-%d'), 'ASC']],
      raw: true,
    }),
    Form.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status'],
      raw: true,
    }),
  ]);

  return { responsesOverTime, formsByStatus };
};

module.exports = { getStats, getCharts };

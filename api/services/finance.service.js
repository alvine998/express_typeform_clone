const { FinanceRecord } = require('../models');
const { Op } = require('sequelize');

const list = async ({ status, category, page = 1, limit = 10 } = {}) => {
  const where = {};
  if (status) where.status = status;
  if (category) where.category = category;

  const offset = (page - 1) * limit;

  const { count, rows } = await FinanceRecord.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    offset,
    limit,
  });

  return {
    records: rows,
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
  };
};

const getById = async (id) => {
  const record = await FinanceRecord.findByPk(id);
  if (!record) {
    const err = new Error('Finance record not found');
    err.statusCode = 404;
    throw err;
  }
  return record;
};

const update = async (id, data) => {
  const record = await getById(id);
  const allowedFields = ['description', 'amount', 'category', 'status', 'date', 'notes'];
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      record[field] = data[field];
    }
  }
  await record.save();
  return record;
};

const approve = async (id, approvedBy) => {
  const record = await getById(id);
  record.status = 'approved';
  record.approved_by = approvedBy;
  await record.save();
  return record;
};

const reject = async (id, approvedBy) => {
  const record = await getById(id);
  record.status = 'rejected';
  record.approved_by = approvedBy;
  await record.save();
  return record;
};

module.exports = { list, getById, update, approve, reject };

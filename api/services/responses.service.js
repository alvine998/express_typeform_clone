const { Form, FormResponse } = require('../models');
const { Op } = require('sequelize');

const submit = async (formId, { respondentName, respondentEmail, answers }) => {
  const form = await Form.findByPk(formId);
  if (!form || form.status !== 'active') {
    const err = new Error('Form not found or not active');
    err.statusCode = 400;
    throw err;
  }

  const response = await FormResponse.create({
    form_id: formId,
    respondent_name: respondentName,
    respondent_email: respondentEmail,
    answers,
  });

  await form.increment('response_count', { by: 1 });

  return { id: response.id, message: 'Response submitted successfully' };
};

const getByForm = async (formId, { page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await FormResponse.findAndCountAll({
    where: { form_id: formId },
    order: [['submitted_at', 'DESC']],
    offset,
    limit,
  });

  return {
    responses: rows,
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
  };
};

const getById = async (id) => {
  const response = await FormResponse.findByPk(id);
  if (!response) {
    const err = new Error('Response not found');
    err.statusCode = 404;
    throw err;
  }
  return response;
};

module.exports = { submit, getByForm, getById };

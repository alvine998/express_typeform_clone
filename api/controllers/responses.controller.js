const responsesService = require('../services/responses.service');
const { response200, response201, response500 } = require('../../utils/response');

const submit = async (req, res, next) => {
  try {
    const { respondentName, respondentEmail, answers } = req.body;
    const result = await responsesService.submit(req.params.id, { respondentName, respondentEmail, answers });
    return response201(res, result);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return response500(res, err.message);
  }
};

const getByForm = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await responsesService.getByForm(req.params.id, { page, limit });
    return response200(res, result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const response = await responsesService.getById(req.params.id);
    return response200(res, response);
  } catch (err) {
    next(err);
  }
};

module.exports = { submit, getByForm, getById };

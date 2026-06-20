const formsService = require('../services/forms.service');
const { response200, response201, response500 } = require('../../utils/response');

const list = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const params = { status, page, limit };
    if (req.user.role !== 'admin') {
      params.userId = req.user.id;
    }
    const result = await formsService.list(params);
    return response200(res, result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const form = await formsService.getById(req.params.id);
    return response200(res, form);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, description, fields } = req.body;
    const form = await formsService.create({ title, description, fields, createdBy: req.user.id });
    return response201(res, form);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const form = await formsService.update(req.params.id, req.body);
    return response200(res, form);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await formsService.remove(req.params.id);
    return response200(res, { message: 'Form deleted' });
  } catch (err) {
    next(err);
  }
};

const duplicate = async (req, res, next) => {
  try {
    const form = await formsService.duplicate(req.params.id);
    return response201(res, form);
  } catch (err) {
    next(err);
  }
};

const report = async (req, res, next) => {
  try {
    return response200(res, { message: 'Report endpoint - to be implemented' });
  } catch (err) {
    next(err);
  }
};

const surveyors = async (req, res, next) => {
  try {
    return response200(res, { message: 'Surveyor stats endpoint - to be implemented' });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove, duplicate, report, surveyors };

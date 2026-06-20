const usersService = require('../services/users.service');
const { response200, response201, response500 } = require('../../utils/response');

const list = async (req, res, next) => {
  try {
    const { search, role, status, page, limit } = req.query;
    const result = await usersService.list({ search, role, status, page, limit });
    return response200(res, result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const user = await usersService.getById(req.params.id);
    return response200(res, user);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const user = await usersService.create(req.body);
    return response201(res, user);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const user = await usersService.update(req.params.id, req.body);
    return response200(res, user);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await usersService.remove(req.params.id);
    return response200(res, { message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove };

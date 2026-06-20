const authService = require('../services/auth.service');
const { response200, response400, response401, response500 } = require('../../utils/response');

const login = async (req, res, next) => {
  try {
    const { token, user } = await authService.login(req.body.email, req.body.password);
    return response200(res, { token, user });
  } catch (err) {
    const status = err.status || err.statusCode || 500;
    if (status === 400) return response400(res, err.message);
    if (status === 401) return response401(res, err.message);
    return response500(res, err.message);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    return response200(res, user);
  } catch (err) {
    next(err);
  }
};

module.exports = { login, getMe };

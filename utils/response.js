const response200 = (res, data, message = 'Success') => {
  return res.status(200).json({ success: true, message, data });
};

const response400 = (res, message = 'Bad Request') => {
  return res.status(400).json({ success: false, message });
};

const response401 = (res, message = 'Unauthorized') => {
  return res.status(401).json({ success: false, message });
};

const response404 = (res, message = 'Not Found') => {
  return res.status(404).json({ success: false, message });
};

const response201 = (res, data, message = 'Created') => {
  return res.status(201).json({ success: true, message, data });
};

const response500 = (res, message = 'Internal Server Error') => {
  return res.status(500).json({ success: false, message });
};

module.exports = { response200, response201, response400, response401, response404, response500 };

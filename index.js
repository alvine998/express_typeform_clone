require('dotenv').config();

const app = require('./api/app');
const { sequelize } = require('./api/models');
const rateLimit = require('express-rate-limit');
const port = process.env.PORT || 4000;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });

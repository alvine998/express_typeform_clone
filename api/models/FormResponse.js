const { v4: uuidv4 } = require('uuid');
const { sequelize, DataTypes } = require('../config/database');

const FormResponse = sequelize.define('FormResponse', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  form_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  respondent_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  respondent_email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  surveyor_id: {
    type: DataTypes.STRING(36),
    allowNull: true,
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'form_responses',
  timestamps: false,
});

module.exports = FormResponse;

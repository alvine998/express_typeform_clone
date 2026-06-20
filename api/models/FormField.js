const { v4: uuidv4 } = require('uuid');
const { sequelize, DataTypes } = require('../config/database');

const FormField = sequelize.define('FormField', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  form_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('text', 'textarea', 'radio', 'checkbox', 'select', 'rating', 'date', 'email', 'number', 'file'),
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  placeholder: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  field_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'form_fields',
  timestamps: false,
});

module.exports = FormField;

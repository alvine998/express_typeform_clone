const { v4: uuidv4 } = require('uuid');
const { sequelize, DataTypes } = require('../config/database');

const Form = sequelize.define('Form', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'closed'),
    defaultValue: 'draft',
  },
  created_by: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  response_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  google_sheet_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'forms',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Form;

const { v4: uuidv4 } = require('uuid');
const { sequelize, DataTypes } = require('../config/database');

const FinanceRecord = sequelize.define('FinanceRecord', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  form_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  form_title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  approved_by: {
    type: DataTypes.STRING(36),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'finance_records',
  timestamps: false,
});

module.exports = FinanceRecord;

const { v4: uuidv4 } = require('uuid');
const { sequelize, DataTypes } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('response', 'form', 'user', 'system'),
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  entity_id: {
    type: DataTypes.STRING(36),
    allowNull: true,
  },
  entity_type: {
    type: DataTypes.ENUM('form', 'response', 'user'),
    allowNull: true,
  },
  user_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'notifications',
  timestamps: false,
});

module.exports = Notification;

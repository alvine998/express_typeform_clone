const Sequelize = require('sequelize');
const { sequelize } = require('../config/database');

const User = require('./User');
const Form = require('./Form');
const FormField = require('./FormField');
const FormResponse = require('./FormResponse');
const ActivityLog = require('./ActivityLog');
const FinanceRecord = require('./FinanceRecord');
const Notification = require('./Notification');

User.hasMany(Form, { foreignKey: 'created_by', as: 'forms', onDelete: 'CASCADE' });
Form.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Form.hasMany(FormField, { foreignKey: 'form_id', as: 'fields', onDelete: 'CASCADE' });
FormField.belongsTo(Form, { foreignKey: 'form_id', as: 'form' });

Form.hasMany(FormResponse, { foreignKey: 'form_id', as: 'responses', onDelete: 'CASCADE' });
FormResponse.belongsTo(Form, { foreignKey: 'form_id', as: 'form' });
User.hasMany(FormResponse, { foreignKey: 'surveyor_id', as: 'surveyorResponses', onDelete: 'SET NULL' });
FormResponse.belongsTo(User, { foreignKey: 'surveyor_id', as: 'surveyor' });

User.hasMany(ActivityLog, { foreignKey: 'user_id', as: 'activityLogs', onDelete: 'CASCADE' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Form.hasMany(FinanceRecord, { foreignKey: 'form_id', as: 'financeRecords', onDelete: 'CASCADE' });
FinanceRecord.belongsTo(Form, { foreignKey: 'form_id', as: 'form' });
FinanceRecord.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Form,
  FormField,
  FormResponse,
  ActivityLog,
  FinanceRecord,
  Notification,
};

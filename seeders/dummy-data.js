require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { sequelize, User, Form, FormField, FormResponse, ActivityLog, FinanceRecord, Notification } = require('../api/models');

const passwordHash = bcrypt.hashSync('admin1234', 10);

const users = [
  { id: 'admin-uuid-1111', name: 'Admin User', email: 'admin@formflow.com', password: passwordHash, role: 'admin', phone: '+1-555-0101', department: 'Engineering', status: 'active' },
  { id: 'admin-uuid-1112', name: 'Bob Admin', email: 'bob@formflow.com', password: passwordHash, role: 'admin', phone: '+1-555-0102', department: 'Operations', status: 'active' },
  { id: 'surv-uuid-2111', name: 'Carol Surveyor', email: 'carol@formflow.com', password: passwordHash, role: 'surveyor', phone: '+1-555-0201', department: 'Field Research', status: 'active' },
  { id: 'surv-uuid-2112', name: 'Dave Surveyor', email: 'dave@formflow.com', password: passwordHash, role: 'surveyor', phone: '+1-555-0202', department: 'Field Research', status: 'active' },
  { id: 'surv-uuid-2113', name: 'Eve Surveyor', email: 'eve@formflow.com', password: passwordHash, role: 'surveyor', phone: '+1-555-0203', department: 'Quality Assurance', status: 'inactive' },
  { id: 'view-uuid-3111', name: 'Frank Viewer', email: 'frank@formflow.com', password: passwordHash, role: 'viewer', phone: '+1-555-0301', department: 'Management', status: 'active' },
  { id: 'view-uuid-3112', name: 'Grace Viewer', email: 'grace@formflow.com', password: passwordHash, role: 'viewer', phone: '+1-555-0302', department: 'Finance', status: 'active' },
  { id: 'view-uuid-3113', name: 'Hank Viewer', email: 'hank@formflow.com', password: passwordHash, role: 'viewer', phone: '+1-555-0303', department: 'HR', status: 'active' },
];

const forms = [
  { id: 'form-uuid-1001', title: 'Customer Satisfaction Survey', description: 'Quarterly feedback from our customers', status: 'active', created_by: 'surv-uuid-2111', response_count: 3 },
  { id: 'form-uuid-1002', title: 'Employee Onboarding', description: 'New hire onboarding checklist', status: 'active', created_by: 'admin-uuid-1111', response_count: 1 },
  { id: 'form-uuid-1003', title: 'Event Registration', description: 'Annual company picnic registration', status: 'draft', created_by: 'surv-uuid-2112', response_count: 0 },
  { id: 'form-uuid-1004', title: 'IT Support Ticket', description: 'Report technical issues', status: 'active', created_by: 'surv-uuid-2111', response_count: 2 },
  { id: 'form-uuid-1005', title: 'Health & Safety Audit', description: 'Monthly workplace safety checklist', status: 'closed', created_by: 'admin-uuid-1112', response_count: 5 },
  { id: 'form-uuid-1006', title: 'Training Feedback', description: 'Post-training course evaluation', status: 'draft', created_by: 'surv-uuid-2113', response_count: 0 },
];

const formFields = [
  { id: 'field-uuid-1101', form_id: 'form-uuid-1001', type: 'text', label: 'Full Name', placeholder: 'Enter your name', required: true, field_order: 1 },
  { id: 'field-uuid-1102', form_id: 'form-uuid-1001', type: 'email', label: 'Email Address', placeholder: 'you@example.com', required: true, field_order: 2 },
  { id: 'field-uuid-1103', form_id: 'form-uuid-1001', type: 'rating', label: 'Overall Rating', required: true, field_order: 3 },
  { id: 'field-uuid-1104', form_id: 'form-uuid-1001', type: 'textarea', label: 'Additional Comments', placeholder: 'Tell us more', required: false, field_order: 4 },
  { id: 'field-uuid-1201', form_id: 'form-uuid-1002', type: 'text', label: 'Employee Name', placeholder: 'First & Last', required: true, field_order: 1 },
  { id: 'field-uuid-1202', form_id: 'form-uuid-1002', type: 'date', label: 'Start Date', required: true, field_order: 2 },
  { id: 'field-uuid-1203', form_id: 'form-uuid-1002', type: 'select', label: 'Department', required: true, options: JSON.stringify(['Engineering', 'HR', 'Finance', 'Ops']), field_order: 3 },
  { id: 'field-uuid-1204', form_id: 'form-uuid-1002', type: 'checkbox', label: 'Documents Received', required: true, options: JSON.stringify(['ID Card', 'Bank Info', 'Tax Form']), field_order: 4 },
  { id: 'field-uuid-1205', form_id: 'form-uuid-1002', type: 'textarea', label: 'Notes', placeholder: 'Additional notes', required: false, field_order: 5 },
  { id: 'field-uuid-1301', form_id: 'form-uuid-1003', type: 'text', label: 'Attendee Name', placeholder: 'Your name', required: true, field_order: 1 },
  { id: 'field-uuid-1302', form_id: 'form-uuid-1003', type: 'email', label: 'Attendee Email', placeholder: 'you@example.com', required: true, field_order: 2 },
  { id: 'field-uuid-1401', form_id: 'form-uuid-1004', type: 'select', label: 'Issue Category', required: true, options: JSON.stringify(['Network', 'Hardware', 'Software', 'Other']), field_order: 1 },
  { id: 'field-uuid-1402', form_id: 'form-uuid-1004', type: 'text', label: 'Subject', placeholder: 'Brief title', required: true, field_order: 2 },
  { id: 'field-uuid-1403', form_id: 'form-uuid-1004', type: 'textarea', label: 'Description', placeholder: 'Describe the issue', required: true, field_order: 3 },
  { id: 'field-uuid-1404', form_id: 'form-uuid-1004', type: 'file', label: 'Screenshot', required: false, field_order: 4 },
  { id: 'field-uuid-1501', form_id: 'form-uuid-1005', type: 'radio', label: 'Fire Extinguisher Checked?', required: true, options: JSON.stringify(['Yes', 'No', 'N/A']), field_order: 1 },
  { id: 'field-uuid-1502', form_id: 'form-uuid-1005', type: 'radio', label: 'Exit Signs Visible?', required: true, options: JSON.stringify(['Yes', 'No']), field_order: 2 },
  { id: 'field-uuid-1503', form_id: 'form-uuid-1005', type: 'textarea', label: 'Findings', placeholder: 'Describe any issues', required: false, field_order: 3 },
  { id: 'field-uuid-1601', form_id: 'form-uuid-1006', type: 'text', label: 'Trainee Name', placeholder: 'Full name', required: true, field_order: 1 },
  { id: 'field-uuid-1602', form_id: 'form-uuid-1006', type: 'rating', label: 'Course Rating', required: true, field_order: 2 },
  { id: 'field-uuid-1603', form_id: 'form-uuid-1006', type: 'textarea', label: 'What did you like?', placeholder: 'Share your thoughts', required: false, field_order: 3 },
];

const formResponses = [
  { id: 'resp-uuid-5001', form_id: 'form-uuid-1001', respondent_name: 'Frank Viewer', respondent_email: 'frank@formflow.com', answers: JSON.stringify({ 'field-uuid-1101': 'Frank Viewer', 'field-uuid-1102': 'frank@formflow.com', 'field-uuid-1103': 4, 'field-uuid-1104': 'Great service!' }) },
  { id: 'resp-uuid-5002', form_id: 'form-uuid-1001', respondent_name: 'Jane Public', respondent_email: 'jane@example.com', answers: JSON.stringify({ 'field-uuid-1101': 'Jane Public', 'field-uuid-1102': 'jane@example.com', 'field-uuid-1103': 5, 'field-uuid-1104': null }) },
  { id: 'resp-uuid-5003', form_id: 'form-uuid-1001', respondent_name: 'Grace Viewer', respondent_email: 'grace@formflow.com', answers: JSON.stringify({ 'field-uuid-1101': 'Grace Viewer', 'field-uuid-1102': 'grace@formflow.com', 'field-uuid-1103': 3, 'field-uuid-1104': 'Average experience' }) },
  { id: 'resp-uuid-5004', form_id: 'form-uuid-1002', respondent_name: 'Hank Viewer', respondent_email: 'hank@formflow.com', answers: JSON.stringify({ 'field-uuid-1201': 'Hank Viewer', 'field-uuid-1202': '2025-07-01', 'field-uuid-1203': 'Engineering', 'field-uuid-1204': ['ID Card', 'Tax Form'], 'field-uuid-1205': null }) },
  { id: 'resp-uuid-5005', form_id: 'form-uuid-1004', respondent_name: 'IT User', respondent_email: 'ituser@example.com', answers: JSON.stringify({ 'field-uuid-1401': 'Network', 'field-uuid-1402': 'VPN not connecting', 'field-uuid-1403': 'Cannot connect to VPN since last update' }) },
  { id: 'resp-uuid-5006', form_id: 'form-uuid-1004', respondent_name: 'Frank Viewer', respondent_email: 'frank@formflow.com', answers: JSON.stringify({ 'field-uuid-1401': 'Software', 'field-uuid-1402': 'Excel crash', 'field-uuid-1403': 'Excel crashes when opening large files' }) },
  { id: 'resp-uuid-5007', form_id: 'form-uuid-1005', respondent_name: 'Dave Surveyor', respondent_email: 'dave@formflow.com', answers: JSON.stringify({ 'field-uuid-1501': 'Yes', 'field-uuid-1502': 'Yes', 'field-uuid-1503': 'All good' }) },
  { id: 'resp-uuid-5008', form_id: 'form-uuid-1005', respondent_name: 'Eve Surveyor', respondent_email: 'eve@formflow.com', answers: JSON.stringify({ 'field-uuid-1501': 'No', 'field-uuid-1502': 'Yes', 'field-uuid-1503': 'Fire extinguisher in B-wing needs recharge' }) },
];

const activityLogs = [
  { id: 'alog-uuid-6001', user_id: 'surv-uuid-2111', user_name: 'Carol Surveyor', action: 'create', entity: 'form', entity_id: 'form-uuid-1001', details: 'Created Customer Satisfaction Survey', ip_address: '192.168.1.10' },
  { id: 'alog-uuid-6002', user_id: 'admin-uuid-1111', user_name: 'Admin User', action: 'update', entity: 'form', entity_id: 'form-uuid-1002', details: 'Updated Employee Onboarding form', ip_address: '192.168.1.20' },
  { id: 'alog-uuid-6003', user_id: 'view-uuid-3111', user_name: 'Frank Viewer', action: 'submit', entity: 'response', entity_id: 'resp-uuid-5001', details: 'Submitted response for Customer Satisfaction Survey', ip_address: '10.0.0.5' },
  { id: 'alog-uuid-6004', user_id: 'surv-uuid-2111', user_name: 'Carol Surveyor', action: 'publish', entity: 'form', entity_id: 'form-uuid-1001', details: 'Published Customer Satisfaction Survey', ip_address: '192.168.1.10' },
  { id: 'alog-uuid-6005', user_id: 'admin-uuid-1112', user_name: 'Bob Admin', action: 'close', entity: 'form', entity_id: 'form-uuid-1005', details: 'Closed Health & Safety Audit', ip_address: '192.168.1.30' },
  { id: 'alog-uuid-6006', user_id: 'surv-uuid-2112', user_name: 'Dave Surveyor', action: 'create', entity: 'form', entity_id: 'form-uuid-1003', details: 'Created Event Registration form (draft)', ip_address: '192.168.1.11' },
  { id: 'alog-uuid-6007', user_id: 'surv-uuid-2113', user_name: 'Eve Surveyor', action: 'submit', entity: 'response', entity_id: 'resp-uuid-5008', details: 'Submitted response for Health & Safety Audit', ip_address: '10.0.0.15' },
  { id: 'alog-uuid-6008', user_id: 'admin-uuid-1111', user_name: 'Admin User', action: 'login', entity: 'user', entity_id: 'admin-uuid-1111', details: 'Admin user logged in', ip_address: '192.168.1.20' },
  { id: 'alog-uuid-6009', user_id: 'surv-uuid-2111', user_name: 'Carol Surveyor', action: 'export', entity: 'form', entity_id: 'form-uuid-1001', details: 'Exported responses to Google Sheets', ip_address: '192.168.1.10' },
  { id: 'alog-uuid-6010', user_id: 'view-uuid-3112', user_name: 'Grace Viewer', action: 'view', entity: 'form', entity_id: 'form-uuid-1001', details: 'Viewed Customer Satisfaction Survey', ip_address: '10.0.0.8' },
];

const financeRecords = [
  { id: 'fin-uuid-7001', form_id: 'form-uuid-1001', form_title: 'Customer Satisfaction Survey', category: 'Project Payment', amount: 1500.00, date: '2025-06-01', status: 'approved', approved_by: 'admin-uuid-1111' },
  { id: 'fin-uuid-7002', form_id: 'form-uuid-1001', form_title: 'Customer Satisfaction Survey', category: 'Hosting', amount: 200.00, date: '2025-06-15', status: 'approved', approved_by: 'admin-uuid-1111' },
  { id: 'fin-uuid-7003', form_id: 'form-uuid-1005', form_title: 'Health & Safety Audit', category: 'Consulting', amount: 3000.00, date: '2025-06-20', status: 'pending' },
  { id: 'fin-uuid-7004', form_id: 'form-uuid-1001', form_title: 'Customer Satisfaction Survey', category: 'Domain', amount: 80.00, date: '2025-06-10', status: 'approved', approved_by: 'admin-uuid-1112' },
  { id: 'fin-uuid-7005', form_id: 'form-uuid-1002', form_title: 'Employee Onboarding', category: 'Refund', amount: 500.00, date: '2025-06-05', status: 'approved', approved_by: 'admin-uuid-1111' },
  { id: 'fin-uuid-7006', form_id: 'form-uuid-1004', form_title: 'IT Support Ticket', category: 'Contract', amount: 1200.00, date: '2025-06-25', status: 'rejected' },
];

const notifications = [
  { id: 'notif-uuid-8001', user_id: 'surv-uuid-2111', title: 'New Response', message: 'Frank Viewer submitted a response', type: 'response', entity_id: 'resp-uuid-5001', entity_type: 'response' },
  { id: 'notif-uuid-8002', user_id: 'surv-uuid-2111', title: 'New Response', message: 'Jane Public submitted a response', type: 'response', entity_id: 'resp-uuid-5002', entity_type: 'response', read: true },
  { id: 'notif-uuid-8003', user_id: 'admin-uuid-1111', title: 'Form Published', message: 'Employee Onboarding form published', type: 'form', entity_id: 'form-uuid-1002', entity_type: 'form' },
  { id: 'notif-uuid-8004', user_id: 'admin-uuid-1112', title: 'Form Closed', message: 'Health & Safety Audit closed', type: 'form', entity_id: 'form-uuid-1005', entity_type: 'form' },
  { id: 'notif-uuid-8005', user_id: 'surv-uuid-2112', title: 'Form Created', message: 'Event Registration form created as draft', type: 'form', entity_id: 'form-uuid-1003', entity_type: 'form', read: true },
  { id: 'notif-uuid-8006', user_id: 'surv-uuid-2113', title: 'Response Saved', message: 'Health & Safety Audit response saved', type: 'response', entity_id: 'resp-uuid-5008', entity_type: 'response', read: true },
  { id: 'notif-uuid-8007', user_id: 'view-uuid-3112', title: 'Payment Received', message: 'Payment of $1,500.00 received', type: 'system', entity_id: 'fin-uuid-7001', entity_type: 'response' },
  { id: 'notif-uuid-8008', user_id: 'admin-uuid-1111', title: 'Payment Failed', message: 'Payment of $1,200.00 failed', type: 'system', entity_id: 'fin-uuid-7006', entity_type: 'response' },
];

async function seed() {
  try {
    await sequelize.sync();

    console.log('Seeding users ...');
    await User.bulkCreate(users, { ignoreDuplicates: true });

    console.log('Seeding forms ...');
    await Form.bulkCreate(forms, { ignoreDuplicates: true });

    console.log('Seeding form fields ...');
    await FormField.bulkCreate(formFields, { ignoreDuplicates: true });

    console.log('Seeding form responses ...');
    await FormResponse.bulkCreate(formResponses, { ignoreDuplicates: true });

    console.log('Seeding activity logs ...');
    await ActivityLog.bulkCreate(activityLogs, { ignoreDuplicates: true });

    console.log('Seeding finance records ...');
    await FinanceRecord.bulkCreate(financeRecords, { ignoreDuplicates: true });

    console.log('Seeding notifications ...');
    await Notification.bulkCreate(notifications, { ignoreDuplicates: true });

    console.log('Seed complete');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();

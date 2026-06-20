CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'surveyor', 'viewer') NOT NULL DEFAULT 'viewer',
  avatar VARCHAR(500),
  phone VARCHAR(20),
  department VARCHAR(100),
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forms (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('draft', 'active', 'closed') NOT NULL DEFAULT 'draft',
  created_by VARCHAR(36) NOT NULL,
  response_count INT DEFAULT 0,
  google_sheet_id VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS form_fields (
  id VARCHAR(36) PRIMARY KEY,
  form_id VARCHAR(36) NOT NULL,
  type ENUM('text','textarea','radio','checkbox','select','rating','date','email','number','file') NOT NULL,
  label VARCHAR(500) NOT NULL,
  placeholder VARCHAR(255),
  required BOOLEAN DEFAULT false,
  options JSON,
  field_order INT NOT NULL,
  FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS form_responses (
  id VARCHAR(36) PRIMARY KEY,
  form_id VARCHAR(36) NOT NULL,
  respondent_name VARCHAR(255) NOT NULL,
  respondent_email VARCHAR(255),
  answers JSON NOT NULL,
  surveyor_id VARCHAR(36),
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
  FOREIGN KEY (surveyor_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100) NOT NULL,
  entity_id VARCHAR(36) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS finance_records (
  id VARCHAR(36) PRIMARY KEY,
  form_id VARCHAR(36) NOT NULL,
  form_title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  amount DECIMAL(15,2) NOT NULL,
  date DATE NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  approved_by VARCHAR(36),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('response', 'form', 'user', 'system') NOT NULL,
  `read` BOOLEAN DEFAULT false,
  entity_id VARCHAR(36),
  entity_type ENUM('form', 'response', 'user'),
  user_id VARCHAR(36) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

DROP INDEX IF EXISTS idx_forms_created_by ON forms;
CREATE INDEX idx_forms_created_by ON forms(created_by);
DROP INDEX IF EXISTS idx_form_fields_form_id ON form_fields;
CREATE INDEX idx_form_fields_form_id ON form_fields(form_id);
DROP INDEX IF EXISTS idx_form_responses_form_id ON form_responses;
CREATE INDEX idx_form_responses_form_id ON form_responses(form_id);
DROP INDEX IF EXISTS idx_activity_logs_user_id ON activity_logs;
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
DROP INDEX IF EXISTS idx_finance_records_form_id ON finance_records;
CREATE INDEX idx_finance_records_form_id ON finance_records(form_id);
DROP INDEX IF EXISTS idx_notifications_user_id ON notifications;
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

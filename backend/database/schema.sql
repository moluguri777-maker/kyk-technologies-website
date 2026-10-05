CREATE DATABASE IF NOT EXISTS kyk_technologies CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kyk_technologies;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL, phone VARCHAR(30), role ENUM('admin','employee','candidate') NOT NULL DEFAULT 'candidate',
  is_active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role), INDEX idx_users_active (is_active)
);
CREATE TABLE IF NOT EXISTS jobs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(180) NOT NULL, department VARCHAR(120), location VARCHAR(120), employment_type VARCHAR(80), experience VARCHAR(120),
  description TEXT, requirements TEXT, responsibilities TEXT, skills TEXT, salary VARCHAR(120), status ENUM('open','closed','draft') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_jobs_status (status)
);
CREATE TABLE IF NOT EXISTS applications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, job_id INT UNSIGNED NOT NULL, candidate_id INT UNSIGNED NULL, name VARCHAR(120) NOT NULL, email VARCHAR(190) NOT NULL,
  phone VARCHAR(30), resume_url VARCHAR(500), cover_letter TEXT, status ENUM('submitted','reviewing','shortlisted','rejected','selected') NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE, FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_applications_status (status), INDEX idx_applications_candidate (candidate_id)
);
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(190) NOT NULL, company VARCHAR(160), phone VARCHAR(30), inquiry_type VARCHAR(100), message TEXT NOT NULL,
  status ENUM('new','read','resolved') NOT NULL DEFAULT 'new', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX idx_contact_status (status)
);
-- Create the first admin securely through the register script or an SQL hash generated with bcrypt; never store a plaintext password here.
INSERT INTO jobs (title, department, location, employment_type, experience, description, skills, status)
SELECT 'Senior Full-Stack Engineer','Technology','Remote / Global','Full-time','3+ years','Build digital products that move businesses forward.','JavaScript, React, Node.js, MySQL','open'
WHERE NOT EXISTS (SELECT 1 FROM jobs WHERE title = 'Senior Full-Stack Engineer');

-- Run: node backend/utils/create-admin.js after setting backend/.env to create an admin account.

CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_contact_created_at ON contact_inquiries(created_at);
CREATE INDEX idx_applications_job ON applications(job_id);

-- The indexes above are idempotent only on a fresh database. If rerunning against an existing schema, remove duplicate index statements.

-- Production note: create a dedicated MySQL user with least-privilege access to kyk_technologies.
-- Example: CREATE USER 'kyk_app'@'localhost' IDENTIFIED BY 'change-me'; GRANT SELECT,INSERT,UPDATE,DELETE ON kyk_technologies.* TO 'kyk_app'@'localhost'; FLUSH PRIVILEGES;

-- First admin workflow: node backend/utils/create-admin.js --name "KYK Admin" --email admin@example.com --password "use-a-strong-password"
-- The password is hashed with bcrypt before insertion.
-- No plaintext credentials are stored in this file.
-- API authentication uses JWT in an HttpOnly cookie.
-- Resume storage is intentionally represented by resume_url until a storage provider is selected.
-- End of schema.
-- Keep migrations in version control as the schema evolves.
-- Use utf8mb4 for multilingual candidate and contact content.
-- Foreign keys preserve referential integrity.
-- Status fields are constrained to supported workflow values.
-- Email fields are indexed through unique users and lookup-friendly application data.
-- This initial schema intentionally excludes payroll, leave, attendance, and HRMS modules.
-- Add those in a later migration rather than expanding this first version.
-- The API returns sanitized error messages to clients.
-- Database errors are logged server-side only.
-- All user-owned application queries scope by candidate_id when applicable.
-- Admin routes require role authorization in middleware.
-- Employee routes expose only the current employee profile in this phase.
-- Public job listing exposes open jobs only.
-- Public application creation validates the referenced job is open.
-- Contact form is rate-limited by the Express server.
-- JWT secret must be long and random in deployed environments.
-- CORS is restricted to CLIENT_URL.
-- Helmet enables baseline security headers.
-- This file is intended for MySQL 8+.
-- Use a database migration tool later if schema changes become frequent.
-- End.

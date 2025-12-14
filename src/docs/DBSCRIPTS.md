# ready‑to‑run SQL script that will set up your MariaDB database, user, and privileges in one go. # Copy/paste this into your MariaDB client (mysql -u root -p)

#  To run MariaDB Shell

.\mariadb.exe -u root -p

#-- Create the database
CREATE DATABASE IF NOT EXISTS attendance_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Create a dedicated user with mysql_native_password
CREATE USER IF NOT EXISTS 'attendance_user'@'localhost'
  IDENTIFIED WITH mysql_native_password BY 'attendance*2025';

-- Grant privileges on the database
GRANT ALL PRIVILEGES ON attendance_db.* TO 'attendance_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Switch to the database
USE attendance_db;

-- Create the user table
CREATE TABLE IF NOT EXISTS user (
  emp_id VARCHAR(20) PRIMARY KEY,
  email_id VARCHAR(40) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  mpin VARCHAR(6),
  otp VARCHAR(6),
  otp_expiry_time SMALLINT,
  emp_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Helpful indexes
CREATE INDEX idx_user_email ON user (email_id);
CREATE INDEX idx_user_status ON user (emp_status);

-- Seed a test user (replace with bcrypt hash of your password)
INSERT INTO user (emp_id, email_id, password, emp_status)
VALUES ('EMP001', 'user@org.in', '$2b$12$replace_with_bcrypt_hash', 'ACTIVE');


#  Create organization_master Table in MariaDB

CREATE TABLE IF NOT EXISTS organization_master (
  org_id VARCHAR(10) NOT NULL,
  org_name VARCHAR(50),
  org_email VARCHAR(50) UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (org_id),
  KEY idx_org_name (org_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# Create project_master table in MariaDB

CREATE TABLE IF NOT EXISTS project_master (
  project_id VARCHAR(20) NOT NULL,
  project_name VARCHAR(60) NOT NULL,
  project_site_id VARCHAR(100),
  client_name VARCHAR(60),
  client_location VARCHAR(100),
  client_contact VARCHAR(15),
  project_site_lat VARCHAR(20),
  project_site_long VARCHAR(20),
  mng_name VARCHAR(60),
  mng_email VARCHAR(40),
  mng_contact VARCHAR(15),
  project_description TEXT,
  project_techstack VARCHAR(200),
  project_assigned_date DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


# Create employee_master table in MariaDB


CREATE TABLE IF NOT EXISTS employee_master (
	`emp_id` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`org_id` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`emp_email` VARCHAR(60) NOT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`emp_name` VARCHAR(60) NOT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`emp_role` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`emp_department` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`emp_phone` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`check_in_out_status` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`created_at` DATETIME NOT NULL DEFAULT current_timestamp(),
	`updated_at` DATETIME NULL DEFAULT NULL ON UPDATE current_timestamp(),
	PRIMARY KEY (`emp_id`) USING BTREE,
	UNIQUE INDEX `uk_emp_email` (`emp_email`) USING BTREE,
	INDEX `fk_employee_org` (`org_id`) USING BTREE,
	CONSTRAINT `fk_employee_org` FOREIGN KEY (`org_id`) REFERENCES `organization_master` (`org_id`) ON UPDATE CASCADE ON DELETE RESTRICT
)
COLLATE='utf8mb4_uca1400_ai_ci'
ENGINE=InnoDB
;


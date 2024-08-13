CREATE DATABASE attendance_application;

USE attendance_application;

CREATE TABLE student_records (
student_id INT AUTO_INCREMENT PRIMARY KEY,
roll_number VARCHAR(255) NOT NULL UNIQUE,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
mobile_number VARCHAR(255)
);

CREATE TABLE student_register (
registrant_id INT AUTO_INCREMENT PRIMARY KEY,
roll_number VARCHAR(255) NOT NULL UNIQUE,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
mobile_number VARCHAR(255)
);

CREATE TABLE student_qrcode (
qrcode_id INT AUTO_INCREMENT PRIMARY KEY,
subject_code VARCHAR(255) NOT NULL,
subject_name VARCHAR(255) NOT NULL,
roll_number VARCHAR(255) NOT NULL
);

CREATE TABLE qrcode_data (
    qr_id INT AUTO_INCREMENT PRIMARY KEY,
    qrcode_id INT NOT NULL,
    FOREIGN KEY (qrcode_id) REFERENCES student_qrcode(qrcode_id),
    INDEX (qrcode_id),
    subject_code VARCHAR(255) NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    qrcode_url TEXT
);

CREATE TABLE student_details (
    details_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(255) NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    registrant_id INT NOT NULL,
    roll_number VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(255) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6), -- Corrected the decimal point placement
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registrant_id) REFERENCES student_register (registrant_id),
    INDEX (subject_code),
    INDEX (registrant_id)
);

CREATE VIEW student_details_view AS
SELECT 
    details_id,
    subject_code,
    subject_name,
    registrant_id,
    roll_number,
    name,
    email,
    mobile_number,
    latitude,
    longitude,
    created_at
FROM 
    student_details;
    
    CREATE TABLE faculty_login (
    facultyid INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    UNIQUE(email)
);

CREATE TABLE faculty_permissions (
    permissionid INT AUTO_INCREMENT PRIMARY KEY,
    facultyid INT NOT NULL,
    subject_code VARCHAR(255) NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (facultyid) REFERENCES faculty_login(facultyid),
    INDEX (facultyid),
    INDEX (subject_code),
    INDEX (subject_name)
);

CREATE TABLE faculty_password_reset_tokens (
    reset_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (email) REFERENCES faculty_login(email),
    INDEX (token)
);











-- Insert command for student_records table --
INSERT INTO student_records (roll_number, name, email, mobile_number) VALUES ("1AT18IS001", "Arun", "arun@gmail.com", "123456789");
INSERT INTO student_records (roll_number, name, email, mobile_number) VALUES ("1AT18IS002", "Bharath", "bharath@gmail.com", "234567891");
INSERT INTO student_records (roll_number, name, email, mobile_number) VALUES ("1AT18IS003", "Deepika", "deepika@gmail.com", "345678921");
INSERT INTO student_records (roll_number, name, email, mobile_number) VALUES ("1AT18IS004", "Sanjana", "sanjana@gmail.com", "456789321");
INSERT INTO student_records (roll_number, name, email, mobile_number) VALUES ("1AT18IS005", "Vaishnavi", "vaishnavi@gmail.com", "567894321");

-- Imnset command for student_qrcode table --
INSERT INTO student_qrcode (subject_code, subject_name, roll_number) 
VALUES ("BTBIH-101", "Cell and Molecular Biology", "1AT18IS001,1AT18IS002,1AT18IS003,1AT18IS004,1AT18IS005");
INSERT INTO student_qrcode (subject_code, subject_name, roll_number) 
VALUES ("BTBIH-103", "Genetics", "1AT18IS001,1AT18IS002,1AT18IS003,1AT18IS004,1AT18IS005");
INSERT INTO student_qrcode (subject_code, subject_name, roll_number) 
VALUES ("BTBIH-102", "Biochemistry of Macromolecules", "1AT18IS001,1AT18IS002,1AT18IS003,1AT18IS004,1AT18IS005");

-- Insert comammnd for qrcode_data table -- 
INSERT INTO qrcode_data ( qrcode_id, subject_code, subject_name, qrcode_url) 
VALUES ("1", "BTBIH-101", "Cell and Molecular Biology", "https://qrcode.tec-it.com/API/QRCode?data=1");
INSERT INTO qrcode_data ( qrcode_id, subject_code, subject_name, qrcode_url) 
VALUES ("3", "BTBIH-102", "Biochemistry of Macromolecules", "https://qrcode.tec-it.com/API/QRCode?data=8");
INSERT INTO qrcode_data (qrcode_id, subject_code, subject_name, qrcode_url) 
VALUES ("4", "BTBIH-103", "Genetics", "https://qrcode.tec-it.com/API/QRCode?data=9");

-- Insert command for faculty_login table --
INSERT INTO faculty_login (email, password) VALUES ('vaishnavivedantha18@gmail.com', 'admin');
INSERT INTO faculty_login (email, password) VALUES ('vaishnavivedantha10@gmail.com', 'admin');
INSERT INTO faculty_login (email, password) VALUES ('yajaman2000@gmail.com', 'admin');

-- Insert command for faculty_permission table --
INSERT INTO faculty_permissions (facultyid, subject_code, subject_name) VALUES ('1','BTBIH-101','Cell and Molecular Biology,');
INSERT INTO faculty_permissions (facultyid, subject_code, subject_name) VALUES ('2','BTBIH-102','Biochemistry of Macromolecules');
INSERT INTO faculty_permissions (facultyid, subject_code, subject_name) VALUES ('3','BTBIH-103','Genetics');

 

DELETE FROM qrcode_data WHERE qr_id = 6;
DELETE FROM qrcode_data WHERE qr_id = 7;





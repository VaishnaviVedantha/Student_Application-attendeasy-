const express = require('express');
const mysql = require ('mysql2/promise');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();

app.use(express.json());

app.use(cors({
    origin:'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'faculty_id', 'stored-rollnumber'],
    credentials: true
}));

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

// Student Registeration Endpoint
app.post('/register', async (req, res) => {
    const { rollnumber, name, email, phonenumber } = req.body; 
    let connection;

    try {
        console.log('Received registration request:', { rollnumber, name, email, phonenumber });

        connection = await pool.getConnection();

        await connection.query(
            'INSERT INTO student_register (roll_number, name, email, mobile_number) VALUES ( ?, ? , ?, ?)', [rollnumber, name, email, phonenumber]
        );
        console.log('Registration Successful');

        res.status(200).json({ message: 'Registration Successful' });
    }  
    catch (error) {
        console.error('Error occurred during registration:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.', details: error.message });
    }
    finally {
        if (connection) {
            connection.release();
        }
    }
});


//Student QR Code Scanner Endpoint
app.get('/QRscanner/:uniqueId', async (req, res) => {
    const { uniqueId } = req.params;
    const { latitude, longitude } = req.query;
    const storedRollnumber = req.headers['stored-rollnumber'];

    if (!storedRollnumber) {
        return res.status(400).json({ error: "Stored Rollnumber is not provided." });
    }

    let connection = null;

    try {
        connection = await pool.getConnection();

        // Debugging: Log received parameters
        console.log("Received uniqueId:", uniqueId);
        console.log("Received latitude:", latitude);
        console.log("Received longitude:", longitude);
        console.log("Received storedRollnumber:", storedRollnumber);

        // Fetch subject details based on the uniqueId from the QR code
        const [qrCodeData] = await connection.query(
            'SELECT qr_id, qrcode_id, subject_code, subject_name FROM qrcode_data WHERE qr_id = ?',
            [uniqueId]
        );

        if (qrCodeData.length === 0) {
            console.log(`QR code ID ${uniqueId} not found in the database.`);
            return res.status(404).json({ error: `QR code ID ${uniqueId} not found.` });
        }

        const { qr_id, qrcode_id, subject_code, subject_name } = qrCodeData[0];
        console.log("Fetched QR code data:", { qr_id, qrcode_id, subject_code, subject_name });

        // Verify the roll number and QR code ID from the student_qrcode table
        const [studentInfo] = await connection.query(
            'SELECT roll_number FROM student_qrcode WHERE qrcode_id = ? AND FIND_IN_SET(?, roll_number) > 0',
            [qrcode_id, storedRollnumber]
        );

        console.log("Query executed to check roll number in student_qrcode:", 
            'SELECT roll_number FROM student_qrcode WHERE qrcode_id = ? AND FIND_IN_SET(?, roll_number) > 0', 
            [qrcode_id, storedRollnumber]
        );

        if (studentInfo.length === 0) {
            console.log(`Roll number ${storedRollnumber} not found or not authorized for QR code ID ${uniqueId}.`);
            return res.status(404).json({ error: `Roll number ${storedRollnumber} not authorized for QR code ID ${uniqueId}.` });
        }

        console.log("Student info found:", studentInfo);

        // Fetch additional student details from student_records
        const [studentRecord] = await connection.query(
            'SELECT student_id, name, email, mobile_number FROM student_records WHERE roll_number = ?',
            [storedRollnumber]
        );

        console.log("Query executed to fetch student record:", 
            'SELECT student_id, name, email, mobile_number FROM student_records WHERE roll_number = ?', 
            [storedRollnumber]
        );

        if (studentRecord.length === 0) {
            console.log(`Student record not found for roll number ${storedRollnumber}.`);
            return res.status(404).json({ error: `Student record not found for roll number ${storedRollnumber}.` });
        }

        const { student_id, name, email, mobile_number } = studentRecord[0];
        console.log("Student record found:", { student_id, name, email, mobile_number });

        // Insert attendance record
        const insertResult = await connection.query(
            'INSERT INTO student_details (subject_code, subject_name, registrant_id, roll_number, name, email, mobile_number, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                subject_code,
                subject_name,
                student_id,
                storedRollnumber,
                name,
                email,
                mobile_number,
                latitude,
                longitude
            ]
        );

        console.log("Insert result:", insertResult);

        if (insertResult[0].affectedRows === 1) {
            console.log(`QR code processed successfully for uniqueId ${uniqueId}.`);
            return res.status(200).json({ 
                message: 'QR code processed successfully.', 
                subject_code,
                subject_name,
                roll_number: storedRollnumber, // Include roll number
                name,
                email,
                mobile_number
            });
        } else {
            console.log("An internal error occurred while processing the QR code.");
            return res.status(500).json({ error: "An internal error occurred while processing the QR code." });
        }
    } catch (error) {
        console.error("Error processing QR code:", error);
        return res.status(500).json({ error: "An internal error occurred while processing the QR code." });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
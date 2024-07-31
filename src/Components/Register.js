import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import graduate_icon from './images/graduate.png';
import user_icon from './images/user.png';
import mail_icon from './images/mail.png';
import phonecall_icon from './images/phone-call.png';
import './style.css';

const URL = process.env.REACT_APP_API_BASE_URL;
console.log('API Base URL:', URL);

const Register = ({ onRegister }) => {
    const [rollnumber, setRollnumber] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhonenumber] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rollnumber || !name || !email || !phonenumber) {
            alert("Please fill in all fields");
            return;
        }
        try {
            console.log('Submitting form Data:', { rollnumber, name, email, phonenumber });
            console.log('Attempting to Register at:', `${URL}/register`);
            const response = await axios.post(`${URL}/register`, {
                rollnumber,
                name,
                email,
                phonenumber
            });
            console.log('Registration Successful:', response.data.message);
            alert('Registration Successful');
            onRegister(rollnumber);
        } catch (error) {
            console.error('Error occurred during registration:', error.response ? error.response.data.error : error.message);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <>
            <Helmet>
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            </Helmet>
            <div className='background-img'>
                <div className='container'>
                    <h1 className='form-title'>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <div className='main-user-info'>
                            <div className='user-input-box'>
                                <img src={graduate_icon} width='20' height='20' alt='' />
                                <input
                                    type='text'
                                    placeholder='Enter Roll Number'
                                    value={rollnumber}
                                    onChange={(e) => setRollnumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='user-input-box'>
                                <img src={user_icon} width='20' height='20' alt='' />
                                <input
                                    type='text'
                                    placeholder='Enter Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='user-input-box'>
                                <img src={mail_icon} width='20' height='20' alt='' />
                                <input
                                    type='email'
                                    placeholder='Enter Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='user-input-box'>
                                <img src={phonecall_icon} width='20' height='20' alt='' />
                                <input
                                    type='tel'
                                    placeholder='Enter Phone Number'
                                    value={phonenumber}
                                    onChange={(e) => setPhonenumber(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className='form-submit-btn'>
                            <button type='submit'>Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;

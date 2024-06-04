require('dotenv').config()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/registerUsersModel.js');
const transporter = require('../config/nodemailerconfig.js');
const generateResetToken = require('../utils/JWT.js');
const {register}= require('module');
const secret =  process.env.SERCRET;
const Email=process.env.EMAIL;
// Register
exports.register = async (req, res) => {
  const { username, email, password, contact_number } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('hashedPassword', hashedPassword);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      contact_number
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '24h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Request Password Reset
exports.requestResetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const token = generateResetToken(user);
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    const mailOptions = {
      from: Email,
      to: email, 
      subject: 'Password Reset',
      text: `Click here to reset your password: ${resetLink}`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset link sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findByPk(decoded.id);
    console.log('decoded', decoded, user, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../models/db');


const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create(name, email, hashedPassword);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error during user registration:', error); 
        res.status(500).json({ error: 'Error registering user' });
    }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};


const getUserProfile = async (req, res) => {
  const userId = req.user.id; 
  try {
      const user = await User.findById(userId); 
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
     
      const { password, ...userProfile } = user;
      res.json(userProfile);
  } catch (error) {
      console.error('Error retrieving user profile:', error);
      res.status(500).json({ error: 'Error retrieving user profile' });
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, password } = req.body;

  try {
  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10); 
    }


    const setQuery = Object.keys(updatedFields)
      .map((key) => `${key} = ?`)
      .join(', ');

    const values = Object.values(updatedFields);
    values.push(userId); 

    await new Promise((resolve, reject) => {
      db.run(`UPDATE users SET ${setQuery} WHERE id = ?`, values, function (err) {
        if (err) {
          console.error('Error updating user profile:', err);
          reject(err);
        } else {
          resolve(this.changes); 
        }
      });
    });

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ error: 'Error updating user profile' });
  }
};



module.exports = { register, login, getUserProfile, updateUserProfile };

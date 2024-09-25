const { db } = require('./db');
const { v4: uuidv4 } = require('uuid');

const User = {
  create: (name, email, password) => {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      db.run(`INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`, [id, name, email, password], function(err) {
        if (err) reject(err);
        else resolve({ id, name, email });
      });
    });
  },

  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
};

module.exports = User;

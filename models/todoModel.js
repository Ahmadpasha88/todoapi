const { db } = require('./db');
const { v4: uuidv4 } = require('uuid');

const Todo = {
  create: (title, userId) => {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      db.run(`INSERT INTO todos (id, title, user_id) VALUES (?, ?, ?)`, [id, title, userId], function(err) {
        if (err) reject(err);
        else resolve({ id, title, userId });
      });
    });
  },

  findByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM todos WHERE user_id = ?`, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  update: (id, title, status) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE todos SET title = ?, status = ? WHERE id = ?`;
      db.run(query, [title, status, id], function(err) {
        if (err) reject(err);
        else resolve({ id, title, status, updated: this.changes > 0 });
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM todos WHERE id = ?`, [id], function(err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  },
};

module.exports = Todo;

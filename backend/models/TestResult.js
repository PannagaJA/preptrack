const db = require('../config/database');

class TestResult {
  static async create(testData) {
    const { user_id, test_type, score, total_questions, time_taken, correct_answers, wrong_answers, test_data } = testData;
    
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO test_results (user_id, test_type, score, total_questions, time_taken, correct_answers, wrong_answers, test_data) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, test_type, score, total_questions, time_taken, correct_answers, wrong_answers, JSON.stringify(test_data)],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, ...testData });
          }
        }
      );
    });
  }

  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM test_results WHERE user_id = ? ORDER BY created_at DESC`,
        [userId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async getLeaderboard(limit = 10) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          u.username,
          COALESCE(COUNT(tr.id), 0) as tests_taken,
          COALESCE(AVG(tr.score * 100.0 / tr.total_questions), 0) as average_score,
          COALESCE(MAX(tr.score * 100.0 / tr.total_questions), 0) as highest_score
         FROM users u
         LEFT JOIN test_results tr ON u.id = tr.user_id
         GROUP BY u.id, u.username
         ORDER BY average_score DESC
         LIMIT ?`,
        [limit],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
}

module.exports = TestResult;
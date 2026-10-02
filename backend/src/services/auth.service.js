import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js'


export async function registerUser({ username, password }) {
  const input = await pool.query('SELECT')
}
//this should be pending because I don't think employees or account users in general can register, but the sysadmin as far as i have understood

//this is implementable as of today
export async function loginUser({ username, password }) {
  const [details] = await pool.query(`
      SELECT a.account_id, a.employee_id, a.username, a.password_hash, a.access_level,
      CONCAT(e.first_name, ' ', e.last_name) AS full_name
      FROM   accounts a
      LEFT   JOIN employees e ON e.employee_id = a.employee_id
      WHERE  a.username = ?
      LIMIT  1;
  `, [username]);

  const accFound = details[0];

  if (!accFound || !(await bcrypt.compare(password, accFound.password_hash))) {
    return ({ error: "Invalid username or password" });
  }

  return {
    account_id: accFound.account_id,
    employee_id: accFound.employee_id,
    username: accFound.username,
    access_level: accFound.access_level,
    full_name: accFound.full_name
  };

}


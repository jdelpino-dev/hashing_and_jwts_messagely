/** User class for message.ly */

import bcrypt from "bcrypt";
import db from "../db.js";

/** User of the site. */
class User {
  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */
  static async register({ username, password, first_name, last_name, phone }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await db.query(
      `INSERT INTO users (username,
                          password,
                          first_name,
                          last_name,
                          phone,
                          join_at,
                          last_login_at)
          VALUES ($1, $2, $3, $4, $5,
                  current_timestamp,
                  current_timestamp)
          RETURNING username,
                    password,
                    first_name,
                    last_name,
                    phone`,
      [username.toLowerCase(), hashedPassword, first_name, last_name, phone]
    );
    return user.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username, password FROM users WHERE username = $1`,
      [username.toLowerCase()]
    );
    const user = result.rows[0];
    if (!user) return false;
    return await bcrypt.compare(password, user.password);
  }

  /** Update last_login_at for user */
  static async updateLoginTimestamp(username) {
    const user = await db.query(
      `UPDATE users
          SET last_login_at = current_timestamp
          WHERE username = $1
          RETURNING username`,
      [username.toLowerCase()]
    );
    return user.rows[0];
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */
  static async all() {
    const users = await db.query(
      `SELECT username,
              first_name,
              last_name,
              phone
          FROM users
          ORDER BY username`
    );
    return users.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */
  static async get(username) {
    const user = await db.query(
      `SELECT username,
              first_name,
              last_name,
              phone,
              join_at,
              last_login_at
          FROM users
          WHERE username = $1`,
      [username.toLowerCase()]
    );
    return user.rows[0];
  }

  /** embedUsers: */
  static embedUsersInfo(rows, keyName) {
    for (let row of rows) {
      row[keyName] = {
        username: row.username,
        first_name: row.first_name,
        last_name: row.last_name,
        phone: row.phone,
      };
      delete row.username;
      delete row.first_name;
      delete row.last_name;
      delete row.phone;
      delete row.to_username; // Remove to_username if it exists
      delete row.from_username; // Remove from_username if it exists
    }
    return rows;
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */
  static async messagesFrom(username) {
    const result = await db.query(
      `SELECT m.id,
              m.body,
              m.sent_at,
              m.read_at,
              m.to_username,
              u2.username,
              u2.first_name,
              u2.last_name,
              u2.phone
          FROM messages AS m
          JOIN users AS u1 ON m.from_username = u1.username
          JOIN users AS u2 ON m.to_username = u2.username
        WHERE m.from_username = $1
        ORDER BY m.sent_at DESC`,
      [username.toLowerCase()]
    );
    return this.embedUsersInfo(result.rows, "to_user");
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */
  static async messagesTo(username) {
    const result = await db.query(
      `SELECT m.id,
              m.body,
              m.sent_at,
              m.read_at,
              u2.username,
              u2.first_name,
              u2.last_name,
              u2.phone
          FROM messages AS m
          JOIN users AS u1 ON m.to_username = u1.username
          JOIN users AS u2 ON m.from_username = u2.username
        WHERE m.to_username = $1
        ORDER BY m.sent_at DESC`,
      [username.toLowerCase()]
    );
    return this.embedUsersInfo(result.rows, "from_user");
  }
}

export default User;

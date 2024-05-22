import { default as Router } from "express";
import User from "../models/user.js";
import {
  authenticateJWT,
  ensureCorrectUser,
  ensureLoggedIn,
} from "./middleware/auth.js";

const router = new Router();

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", authenticateJWT, ensureLoggedIn, (req, res) => {
  res.json({ users: User.all() });
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get(
  "/:username",
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  (req, res) => {
    const user = User.get(req.params.username);
    if (user) {
      res.json({ user: user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  }
);

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get(
  "/:username/to",
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  (req, res) => {
    const messages = User.messagesTo(req.params.username);
    res.json({ messages: messages });
  }
);

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get(
  ":username/from",
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  (req, res) => {
    const messages = User.messagesFrom(req.params.username);
    res.json({ messages: messages });
  }
);

export default router;

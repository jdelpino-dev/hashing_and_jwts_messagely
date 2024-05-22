import { default as Router } from "express";
import {
  authenticateJWT,
  ensureCorrectUser,
  ensureLoggedIn,
} from "../middleware/auth.js";
import User from "../models/user.js";

const router = new Router();

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", authenticateJWT, ensureLoggedIn, async (req, res) => {
  res.json({ users: await User.all() });
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
  async (req, res) => {
    const user = await User.get(req.params.username);
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
  async (req, res) => {
    const messages = await User.messagesTo(req.params.username);
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
  "/:username/from",
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  async (req, res) => {
    const messages = await User.messagesFrom(req.params.username);
    res.json({ messages: messages });
  }
);

export default router;

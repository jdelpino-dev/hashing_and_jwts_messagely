import express from "express";
import ExpressError from "../expressError.js";
import { authenticateJWT, ensureLoggedIn } from "../middleware/auth.js";
import Message from "../models/message.js";

const router = new express.Router();

/** GET /:id - get detail of message.
 *
 * => {message: {id, body, sent_at, read_at, from_user: {username, first_name, last_name, phone}, to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in user is either the to or from user.
 *
 **/
router.get("/:id", authenticateJWT, ensureLoggedIn, async (req, res, next) => {
  try {
    const message = await Message.get(req.params.id);

    if (
      req.user.username !== message.from_user.username &&
      req.user.username !== message.to_user.username
    ) {
      throw new ExpressError("Unauthorized", 401);
    }

    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", authenticateJWT, ensureLoggedIn, async (req, res, next) => {
  try {
    const { to_username, body } = req.body;
    const from_username = req.user.username;

    const message = await Message.create({ from_username, to_username, body });
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that only the intended recipient can mark as read.
 *
 **/
router.post(
  "/:id/read",
  authenticateJWT,
  ensureLoggedIn,
  async (req, res, next) => {
    try {
      const message = await Message.get(req.params.id);

      if (req.user.username !== message.to_user.username) {
        throw new ExpressError("Unauthorized", 401);
      }

      const updatedMessage = await Message.markRead(req.params.id);
      return res.json({ message: updatedMessage });
    } catch (err) {
      return next(err);
    }
  }
);

export default router;

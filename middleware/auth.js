/** Middleware for handling req authorization for routes. */

import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";
import ExpressError from "../expressError.js";
import User from "../models/user.js";

/** Middleware: Authenticate user. */
// I updated this function to use current best practices for token handling.
// It expect the token to be in the authentication header and not in the body
// of the request. Sending tokens in the body is not secure.
function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    return next();
  } catch (e) {
    console.error(e);
    const error = new ExpressError("Unauthorized:", 401);
    return next(error);
  }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  try {
    if (req.user) {
      return next();
    } else {
      throw ExpressError("Unauthorized", 401);
    }
  } catch (err) {
    return next(err);
  }
}

/** Middleware: Requires correct username. */
function ensureCorrectUser(req, res, next) {
  if (!req.user || req.user.username !== req.params.username) {
    return next(new ExpressError("Unauthorized", 401));
  } else {
    return next();
  }
}

async function loginUser(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ExpressError("Username and password required", 400);
    }
    if (User.authenticate(username, password)) {
      await User.updateLoginTimestamp(username);
      const token = jwt.sign({ username }, SECRET_KEY);
      return res.json({ message: `Logged in!`, token });
    }
    throw new ExpressError("Invalid username/password", 400);
  } catch (e) {
    return next(e);
  }
}

async function registerUser(req, res, next) {
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    if (!username || !password || !first_name || !last_name || !phone) {
      throw new ExpressError("All fields required", 400);
    }
    await User.register({
      username,
      password,
      first_name,
      last_name,
      phone,
    });
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ message: `Welcome ${username}!`, token });
  } catch (err) {
    if (err.code === "23505") {
      // 23505 is the Postgres unique constraint error code
      return next(
        new ExpressError("Username taken. Please pick another!", 400)
      );
    }
    return next(new ExpressError(err, 400));
  }
}

export {
  authenticateJWT,
  ensureCorrectUser,
  ensureLoggedIn,
  loginUser,
  registerUser,
};

/** Middleware for handling req authorization for routes. */

import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";
import ExpressError from "../expressError.js";

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

/** Middleware: Requires correct username. */
function ensureCorrectUser(req, res, next) {
  if (!req.user || req.user.username !== req.params.username) {
    return next(new ExpressError("Unauthorized", 401));
  } else {
    return next();
  }
}

export { authenticateJWT, ensureCorrectUser, ensureLoggedIn };

/** Middleware for handling req authorization for routes. */

import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";

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
    return next();
  }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return next({ status: 401, message: "Unauthorized" });
  } else {
    return next();
  }
}

/** Middleware: Requires correct username. */

function ensureCorrectUser(req, res, next) {
  try {
    if (req.user.username === req.params.username) {
      return next();
    } else {
      return next({ status: 401, message: "Unauthorized" });
    }
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next({ status: 401, message: "Unauthorized" });
  }
}
// end

export { authenticateJWT, ensureCorrectUser, ensureLoggedIn };

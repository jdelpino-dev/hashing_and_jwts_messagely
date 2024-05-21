/** Common config for message.ly */

// read .env files and make environmental variables

// @ts-ignore
import "dotenv/config";

const DB_URI =
  process.env.NODE_ENV === "test"
    ? "postgresql:///messagely-test"
    : "postgresql:///messagely";

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const BCRYPT_WORK_FACTOR = 12;

export { BCRYPT_WORK_FACTOR, DB_URI, SECRET_KEY };

/** Common config for message.ly */

import "dotenv/config"; // read .env files and make changes to env variables

const DB_URI =
  process.env.NODE_ENV === "test"
    ? "postgresql:///messagely-test"
    : "postgresql:///messagely";

const SECRET_KEY = process.env.SECRET_KEY || ")/$·%secretura-48124628·$&%16";

const BCRYPT_WORK_FACTOR = 12;

export { BCRYPT_WORK_FACTOR, DB_URI, SECRET_KEY };

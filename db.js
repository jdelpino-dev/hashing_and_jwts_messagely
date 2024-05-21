/** Database connection for messagely. */

import pg from "pg";
import DB_URI from "./config";
const Client = pg.Client;

const client = new Client(DB_URI);

client.connect();

export default client;

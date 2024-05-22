import "dotenv/config"; // read .env files and make changes to env variables
import db from "../db.js";
import Message from "../models/message.js";
import User from "../models/user.js";

process.env.NODE_ENV = "test";

describe("Test Message class", function () {
  let u1, u2;
  let m1, m2;

  beforeAll(async function () {
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");
  });

  beforeEach(async function () {
    // Clear tables and reset sequence
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");

    // Create users
    u1 = await User.register({
      username: "test1",
      password: "password",
      first_name: "Test1",
      last_name: "Testy1",
      phone: "+14155550000",
    });
    u2 = await User.register({
      username: "test2",
      password: "password",
      first_name: "Test2",
      last_name: "Testy2",
      phone: "+14155552222",
    });

    // Verify users were created
    const users = await User.all();
    expect(users).toHaveLength(2);

    // Create messages
    m1 = await Message.create({
      from_username: "test1",
      to_username: "test2",
      body: "u1-to-u2",
    });
    m2 = await Message.create({
      from_username: "test2",
      to_username: "test1",
      body: "u2-to-u1",
    });
  });

  afterAll(async function () {
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");
    await db.end();
  });

  test("can create", async function () {
    const message = await Message.create({
      from_username: "test1",
      to_username: "test2",
      body: "new",
    });

    expect(message).toEqual({
      id: expect.any(Number),
      from_username: "test1",
      to_username: "test2",
      body: "new",
      sent_at: expect.any(Date),
    });
  });

  test("can mark read", async function () {
    await Message.markRead(m1.id);
    m1 = await Message.get(m1.id);
    expect(m1.read_at).toEqual(expect.any(Date));
  });

  test("can get", async function () {
    const message = await Message.get(m1.id);
    expect(message).toEqual({
      id: expect.any(Number),
      body: "u1-to-u2",
      sent_at: expect.any(Date),
      read_at: null,
      from_user: {
        username: "test1",
        first_name: "Test1",
        last_name: "Testy1",
        phone: "+14155550000",
      },
      to_user: {
        username: "test2",
        first_name: "Test2",
        last_name: "Testy2",
        phone: "+14155552222",
      },
    });
  });
});

const user_sessions = require("./database/user_sessions");
const crypto = require("crypto");

function generate_session() {
  const state = crypto.randomBytes(20).toString("hex");
  user_sessions.set_user_value(state);
  return state;
}

module.exports = generate_session;

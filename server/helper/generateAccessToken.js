const jsonwebtoken = require("jsonwebtoken");
const  JWT_SECRET = process.env.JWT_SECRET 

const access_token = (token_payload) => {
  return jsonwebtoken.sign(token_payload, JWT_SECRET);
};

module.exports = { access_token };
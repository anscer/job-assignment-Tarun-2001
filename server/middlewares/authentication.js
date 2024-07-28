const jwtWebToken = require("jsonwebtoken");
const MetaError = require("../errors/MetaError");
const asyncWrapper = require("./asyncWrapper");
const JWT_SECRET = process.env.JWT_SECRET;

const protect = asyncWrapper(async (req, res, next) => {
  const header_token = req.header("Authorization");
  if (!header_token || !header_token.startsWith("Bearer "))
    throw new MetaError.Unautherized("Please provide valid token");
  const auth_token = header_token.split(" ")[1];
  const user = jwtWebToken.verify(auth_token, JWT_SECRET);
  if (!user) throw new MetaError.Unautherized("Please provide valid token");
  req.user = user.token_payload;
  next();
});

module.exports = { protect};

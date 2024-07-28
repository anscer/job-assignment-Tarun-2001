const { StatusCodes } = require('http-status-codes');
const MetaError = require('../errors/MetaError');
const asyncWrapper = require('../middlewares/asyncWrapper');
const User = require('../model/userModel');

const login = asyncWrapper(async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password)
      throw new MetaError.BadRequest("Please provide password and username");
    const users = await User.findOne({ username })
    if (!users) throw new MetaError.Unautherized("User not exist");
    const isPasswordCorrect = await users.comparePassword(password);
    if (!isPasswordCorrect) throw new MetaError.Unautherized("Invalid Credentials");
    const token = users.createJWT();
    const ouput = {...users}
    delete ouput._doc.password
    res.status(StatusCodes.OK).json({ users:ouput._doc, token });
  });
  
  const register = asyncWrapper(async (req, res, next) => {
    const {username} = req.body
    let checkUser = User.findOne({username})
    if(!checkUser) throw new MetaError.BadRequest('User already exist')
    const register = await User.create({ ...req.body });
    const token = register.createJWT();
    res.status(StatusCodes.CREATED).json({ register, token });
  });

  module.exports = {login,register}
 const asyncWrapper = (handler) => {
  return async (req, res, next) => {
    await handler(req, res, next).catch((error) => {
      next(error);
    });
  };
};

module.exports = asyncWrapper
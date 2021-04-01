//If promise rejected from exported route handler, catchAsync catches next(error)
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

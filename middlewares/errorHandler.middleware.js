const errorHandler = (err, req, res, next) => {
  const { stack, message } = err;
  console.error(stack);
  res.status(500).json({ message });
};

module.exports = errorHandler;

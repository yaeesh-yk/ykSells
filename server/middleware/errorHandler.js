const errorHandler = (error, req, res, next) => {
  console.error(error);
  const status = error.name === 'ValidationError' ? 400 : error.statusCode || 500;
  res.status(status).json({ success: false, message: status === 500 ? 'Something went wrong on the server' : error.message });
};
module.exports = errorHandler;
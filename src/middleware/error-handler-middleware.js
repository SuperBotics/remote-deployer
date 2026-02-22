function errorHandlerMiddleware(error, request, response, next) {
  void request;
  void next;
  const statusCode = error.statusCode || 500;
  response.status(statusCode).json({
    status: 'error',
    message: error.publicMessage || 'unexpected server error.'
  });
}

module.exports = {
  errorHandlerMiddleware
};

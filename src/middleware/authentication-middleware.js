function createAuthenticationMiddleware({ deploymentAuthenticationKey }) {
  return function authenticationMiddleware(request, response, next) {
    const providedAuthenticationKey = request.header('x-deployment-key');

    if (!providedAuthenticationKey || providedAuthenticationKey !== deploymentAuthenticationKey) {
      return response.status(401).json({
        status: 'unauthorized',
        message: 'missing or invalid x-deployment-key header.'
      });
    }

    return next();
  };
}

module.exports = {
  createAuthenticationMiddleware
};

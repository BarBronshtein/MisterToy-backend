const logger = require('../services/logger-service');
const authService = require('../auth/auth-service');

async function requireAuth(req, res, next) {
  if (!req?.cookies?.loginToken) {
    return res.status(401).send('Not Authernticated');
  }
  const loggedinUser = authService.validateToken(req.cookies.loginToken);
  if (!loggedinUser) return res.status(401).send('Not Authenticated');
  next();
}

async function requireAdmin(req, res, next) {
  if (!req?.cookies?.loginToken) {
    return res.status(401).send('Not Authenticated');
  }
  const loggedinUser = authService.validateToken(req.cookies.loginToken);
  if (!loggedinUser.isAdmin) {
    logger.warn(loggedinUser.fullName + 'attempted to perform admin action');
    res.status(403).end('Not Authorized');
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};
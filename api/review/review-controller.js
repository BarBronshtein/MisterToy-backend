const logger = require('../../services/logger-service');
const userService = require('../user/user-service');
const authService = require('../auth/auth-service');
// const socketService = require('../../services/socket-service')
const reviewService = require('./review-service');

async function getReviews(req, res) {
  try {
    const reviews = await reviewService.query(req.query);
    res.send(reviews);
  } catch (err) {
    logger.error('Cannot get reviews', err);
    res.status(500).send({ err: 'Failed to get reviews' });
  }
}

async function deleteReview(req, res) {
  try {
    const deletedCount = await reviewService.remove(req.params.id);
    if (!deletedCount) {
      res.status(400).send({ err: 'Cannot remove review' });
    } else {
      res.send({ msg: 'Deleted successfully' });
    }
  } catch (err) {
    logger.error('Failed to delete review', err);
    res.status(500).send({ err: 'Failed to delete review' });
  }
}

async function addReview(req, res) {
  let loggedinUser = authService.validateToken(req.cookies.loginToken);
  try {
    let review = req.body;
    review.byUserId = loggedinUser._id;
    review = await reviewService.add(review);

    // prepare the updated review for sending out
    review.byUser = await userService.getById(review.byUserId);

    loggedinUser = await userService.update(loggedinUser);
    review.byUser = loggedinUser;

    // User info is saved also in the login-token, update it
    const loginToken = authService.getLoginToken(loggedinUser);
    res.cookie('loginToken', loginToken);

    // socketService.broadcast({type: 'review-added', data: review, userId: review.byUserId})
    // socketService.emitToUser({type: 'review-about-you', data: review, userId: review.aboutUserId})

    // const fullUser = await userService.getById(loggedinUser._id)
    // socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

    res.send(review);
  } catch (err) {
    logger.error('Failed to add review', err);
    res.status(500).send({ err: 'Failed to add review' });
  }
}

module.exports = {
  getReviews,
  deleteReview,
  addReview,
};

const service = require("./reviews.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function reviewExists(req, res, next) {

    const review = await service.read(req.params.reviewId)

    if (review) {
        res.locals.review = review;
        return next();
    }
    next({ status: 404, message: "Review cannot be found." })

}

async function update(req, res, next) {
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.review.review_id
    }

    await service.update(updatedReview)
    const review = await service.read(updatedReview.review_id)


    res.json({ data: review })
}

function destroy(req, res, next) {

    service.destroy(res.locals.review.review_id)
        .then(() => res.sendStatus(204))
        .catch(next)
}

module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), destroy]
}
const { default: rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
})

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: "Too many unsuccessful authorization attempts. Please try again later"
})

module.exports = { authLimiter, limiter }
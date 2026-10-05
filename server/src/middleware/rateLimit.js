const ApiError = require("../error/handleApiError");

// Small in-memory, per-IP fixed-window limiter. Fine for a single instance;
// on serverless each instance keeps its own counts, which still caps bursts.
const rateLimit = ({ windowMs = 60_000, max = 10, message = "Too many requests. Please try again in a minute." } = {}) => {
    const hits = new Map();
    return (req, res, next) => {
        const now = Date.now();
        const key = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip || "unknown";
        const entry = hits.get(key);
        if (!entry || now - entry.start > windowMs) {
            hits.set(key, { start: now, count: 1 });
        } else if (++entry.count > max) {
            res.setHeader("Retry-After", Math.ceil((entry.start + windowMs - now) / 1000));
            return next(new ApiError(429, message));
        }
        if (hits.size > 5000) hits.clear(); // bound memory
        next();
    };
};

module.exports = rateLimit;

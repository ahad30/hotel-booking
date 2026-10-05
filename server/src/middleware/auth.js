const jwt = require("jsonwebtoken");
const ApiError = require("../error/handleApiError");
const config = require("../config/dotenv");

const readToken = (req) => {
    const header = req.headers.authorization || "";
    return header.startsWith("Bearer ") ? header.slice(7).trim() : null;
};

const signToken = (user) =>
    jwt.sign({ id: user.id, phone: user.phone, role: user.role }, config.jwt_secret, { expiresIn: config.jwt_expires_in });

// Requires a valid token; with roles given, the caller must have one of them.
const auth = (...roles) => (req, res, next) => {
    const token = readToken(req);
    if (!token) return next(new ApiError(401, "Please log in to continue."));

    try {
        req.user = jwt.verify(token, config.jwt_secret);
    } catch {
        return next(new ApiError(401, "Your session has expired. Please log in again."));
    }

    if (roles.length && !roles.includes(req.user.role)) {
        return next(new ApiError(403, "You don't have permission to do that."));
    }

    // Optional public demo admin: can look around the dashboard but not change data.
    if (config.demo_admin_phone && req.user.phone === config.demo_admin_phone && req.method !== "GET") {
        return next(new ApiError(403, "This is a read-only demo account, so changes are disabled."));
    }

    next();
};

// Attaches req.user when a valid token is present; never rejects.
const optionalAuth = (req, res, next) => {
    const token = readToken(req);
    if (token) {
        try {
            req.user = jwt.verify(token, config.jwt_secret);
        } catch {
            /* treat as anonymous */
        }
    }
    next();
};

// Use after auth(): admins pass, others only for their own resource.
const selfOrAdmin = (param) => (req, res, next) => {
    if (req.user?.role === "admin" || req.user?.id === req.params[param]) return next();
    next(new ApiError(403, "You can only access your own account."));
};

module.exports = { auth, optionalAuth, selfOrAdmin, signToken };

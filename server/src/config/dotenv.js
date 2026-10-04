const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });

// Accepts the base URL with or without a trailing slash or /api/v1 suffix.
const baseUrl = (value, fallback) =>
    (value || fallback).trim().replace(/\/+$/, "").replace(/\/api\/v1$/, "");

const dotenvHelper={
    // The Vercel projects define SERVER_URL / CLIENT_URL; BACKEND_URL / FRONTEND_URL are older names.
    backend_url: baseUrl(process.env.SERVER_URL || process.env.BACKEND_URL, "http://localhost:5000"),
    frontend_url: baseUrl(process.env.CLIENT_URL || process.env.FRONTEND_URL, "http://localhost:5173"),
    sslcommerz_store_id: process.env.SSLCOMMERZ_STORE_ID || "your_store_id",
    sslcommerz_store_password: process.env.SSLCOMMERZ_STORE_PASSWORD || "your_store_password",
    sslcommerz_is_live: process.env.SSLCOMMERZ_IS_LIVE || false,
    sslcommerz_success_url: process.env.SSLCOMMERZ_SUCCESS_URL || "http://localhost:5000/api/v1/payment/success",
}
module.exports = dotenvHelper;

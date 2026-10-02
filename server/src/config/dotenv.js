const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });
const dotenvHelper={
    backend_url: process.env.BACKEND_URL || "http://localhost:5000",
    frontend_url: process.env.FRONTEND_URL || "http://localhost:3000",
    sslcommerz_store_id: process.env.SSLCOMMERZ_STORE_ID || "your_store_id",
    sslcommerz_store_password: process.env.SSLCOMMERZ_STORE_PASSWORD || "your_store_password",
    sslcommerz_is_live: process.env.SSLCOMMERZ_IS_LIVE || false,
    sslcommerz_success_url: process.env.SSLCOMMERZ_SUCCESS_URL || "http://localhost:5000/api/v1/payment/success",
}
module.exports = dotenvHelper;

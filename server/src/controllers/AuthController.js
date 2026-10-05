const { signToken } = require("../middleware/auth");
const publicUser = require("../shared/publicUser");

class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async login(req, res, next) {
        try {
            const { phone, password } = req.body;

            if (!phone || !password) {
                return res.status(400).json({ success: false, message: "Phone and password are required" });
            }

            const user = await this.authService.varifyUser(phone, password);

            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }

            return res.status(200).json({
                success: true,
                message: "Login successful",
                token: signToken(user),
                user: publicUser(user),
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;

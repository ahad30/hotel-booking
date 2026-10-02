const jwt = require("jsonwebtoken");


class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async login(req, res, next) {
        try {
            const { phone, password } = req.body;

            if (!phone || !phone) {
                return res.status(400).json({ success: false, message: "phone and password are required" });

            }

            const user = await this.authService.varifyUser(phone, password)
            
            // console.log(user);
            
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }
            console.log(user)
            const token = jwt.sign(
                { id: user.id, phone: user.phone, role: user.role },
                "key123", 
                { expiresIn: "1h" } 
              );
              return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                user
              });

        } catch (error) {
            console.error(error)
            next(error)
        }
    }
}



module.exports =AuthController
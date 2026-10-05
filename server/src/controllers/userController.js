const ApiError = require("../error/handleApiError");
const ResponseHandler = require("../shared/response.handaler");
const publicUser = require("../shared/publicUser");

// Fields a user may change on their own account. Admins may also set these.
const SELF_EDITABLE = ["name", "phone", "email", "password"];
const ADMIN_EDITABLE = [...SELF_EDITABLE, "role", "isVerified"];

const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj?.[k] !== undefined).map((k) => [k, obj[k]]));

class UserController {
    constructor(userService) {
      this.userService = userService;
    }

    // Public sign-up always creates a guest account; only a signed-in admin
    // may create other admins (from the dashboard).
    async createUser(req, res, next) {
      try {
        const isAdmin = req.user?.role === "admin";
        const role = isAdmin && req.body.role === "admin" ? "admin" : "user";
        const result = await this.userService.createUser({ ...req.body, role });

        if (!result) {
          throw new ApiError(400, "user can not create!");
        }
        ResponseHandler.success(res, "User registered successfully", publicUser(result), 201);
      } catch (error) {
        next(error);
      }
    }

    async getAllUsers(req, res, next) {
      try {
        const result = await this.userService.getAllUsers();
        res.status(200).json({
          success: true,
          message: "Users fetched successfully",
          data: result.map(publicUser),
        });
      } catch (error) {
        next(error);
      }
    }

    // The account behind the current token.
    async getMe(req, res, next) {
      try {
        const result = await this.userService.getSingleUser(req.user.id);
        if (!result) throw new ApiError(404, "Account not found");
        ResponseHandler.success(res, "Current user", publicUser(result));
      } catch (error) {
        next(error);
      }
    }

    async getSingleUser(req, res, next) {
      try {
        const userId = req.params.id;
        const result = await this.userService.getSingleUser(userId);
        res.status(200).json({
          success: true,
          message: `User with ID ${userId} fetched successfully`,
          data: publicUser(result),
        });
      } catch (error) {
        next(error);
      }
    }

    async updateUser(req, res, next) {
      try {
        const userId = req.params.id;
        const allowed = req.user?.role === "admin" ? ADMIN_EDITABLE : SELF_EDITABLE;
        const result = await this.userService.updateUser(userId, pick(req.body, allowed));
        res.status(200).json({
          success: true,
          message: `User with ID ${userId} updated successfully`,
          data: publicUser(result),
        });
      } catch (error) {
        next(error);
      }
    }

    async deleteUser(req, res, next) {
      try {
        const userId = req.params.id;
        await this.userService.deleteUser(userId);
        res.status(200).json({
          success: true,
          message: `User with ID ${userId} deleted successfully`,
        });
      } catch (error) {
        next(error);
      }
    }

    async verifyUser(req, res, next) {
      try {
        const { token } = req.params;
        const result = await this.userService.verifyUser(token);

        if (!result || result.success === false) {
          return res.status(400).json({
            success: false,
            message: "Invalid or expired token",
          });
        }

        return res.status(200).json({
          success: true,
          message: "User verified successfully",
          data: publicUser(result),
        });
      } catch (error) {
        next(error);
      }
    }
}

module.exports = UserController;

const { PrismaClient } = require("@prisma/client");
const ApiError = require("../error/handleApiError");
const ResponseHandler = require("../shared/response.handaler");
const prisma = new PrismaClient();

class UserController {
    constructor(userService) {
      this.userService = userService; 
    }
  
    // Create a new user
    async createUser(req, res, next) {
      try {
        const result = await this.userService.createUser(req.body);

        if(!result)
        {
          throw new ApiError(400,"user can not create!");
        }
        ResponseHandler.success(res,"User registered  successfully",result,201)
       
      } catch (error) {
        next(error);
      }
    }
    // Get all users
    async getAllUsers(req, res, next) {
      try {
        const result = await this.userService.getAllUsers();
        res.status(200).json({
          success: true,
          message: 'Users fetched successfully',
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  
    // Get a single user by ID
    async getSingleUser(req, res, next) {
      try {
        const userId = req.params.id; 
        const result = await this.userService.getSingleUser(userId);
        res.status(200).json({
          success: true,
          message: `User with ID ${userId} fetched successfully`,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  
    // Update a user by ID
    async updateUser(req, res, next) {
      try {
        const userId = req.params.id; 
        const result = await this.userService.updateUser(userId, req.body);
        res.status(200).json({
          success: true,
          message: `User with ID ${userId} updated successfully`,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }


    async updatePassword(req, res, next) {
    try {
      const userId = req.params.id;
      const { newPassword, confirmPassword } = req.body;

      // Validate that newPassword and confirmPassword are provided
      if (!newPassword || !confirmPassword) {
        throw new Error("New password and confirm password are required.");
      }

      // Call the service to update the password
      const result = await this.userService.updatePassword(
        userId,
        newPassword,
        confirmPassword
      );

      res.status(200).json({
        success: true,
        message: `Password for user with ID ${userId} updated successfully`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
    // Delete a user by ID
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

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User verified successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
  } 
  
  module.exports = UserController;
  
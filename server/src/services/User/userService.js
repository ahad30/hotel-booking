const ApiError = require("../../error/handleApiError");
const SendEmailUtility = require("../../shared/SendEmailUtility ");
const BcryptHasher = require("../../utility/BcryptPasswordHasher");
const crypto = require("crypto")
class UserService extends BcryptHasher {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async createUser(data) {

    const existingEmailUser = await this.prisma.user.findUnique({
      where: { phone: data.phone },
    });

    if (existingEmailUser) {

      throw new ApiError(409, "User already exists ! please try to login!")
    }



    const hashedPassword = await this.hash(data.password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: data.role,
        name: data.name,
        verificationToken,
        tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // const verificationLink = `https://inkspire-steel.vercel.app/verify/${verificationToken}`;

    // await SendEmailUtility
    // .sendEmail(
    //   user.email,
    //   `<p>Click <a href="${verificationLink}">here</a> to verify your account.</p>`,
    //   "Verify Your Account"
    // );

    return user;


  }

  async getAllUsers() {

    return await this.prisma.user.findMany();

  }

  async getSingleUser(userId) {

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });


    return user;

  }

  async updateUser(userId, data) {

    if (data.password) {
      // Hash the password if it's being updated
      data.password = await this.hash(data.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    return updatedUser;

  }

  async updatePassword(userId, newPassword, confirmPassword) {

    if (newPassword !== confirmPassword) {
      throw new ApiErrorError(401, "New password and confirm password do not match.");
    }

    const hashedPassword = await this.hash(newPassword, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return updatedUser;

  }

  async deleteUser(userId) {

    return await this.prisma.user.delete({
      where: { id: userId },
    });



  }
  async verifyUser(verificationToken) {
    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: verificationToken,
        tokenExpiresAt: { gte: new Date() },
      },
    });

    if (!user) {
      return { success: false, message: "Invalid or expired token" };
    }
    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        tokenExpiresAt: null,
      },
    });

  }

}

module.exports = UserService;
const { PrismaClient } = require("@prisma/client");

class DivisionService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createDivision(data) {
    const division = await this.prisma.division.create({
      data,
    });
    return division;
  }

  async getAllDivisions() {
    const divisions = await this.prisma.division.findMany();
    return divisions;
  }

  async getDivisionById(id) {
    const division = await this.prisma.division.findUnique({
      where: { id },
    });

    if (!division) {
      throw new Error("Division not found");
    }

    return division;
  }

  async updateDivision(id, data) {
    const updatedDivision = await this.prisma.division.update({
      where: { id },
      data,
    });

    return updatedDivision;
  }

  async deleteDivision(id) {
    await this.prisma.division.delete({
      where: { id },
    });

    return { message: "Division deleted successfully" };
  }
}

module.exports = DivisionService;

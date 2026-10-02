const { PrismaClient } = require("@prisma/client");

class AreaService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createArea(data) {
    const area = await this.prisma.area.create({
      data,
    });
    return area;
  }

  async getAllAreas() {
    return await this.prisma.area.findMany({
    //   include: {
    //     district: true, // Optional: to include district info
    //   },
    });
  }

  async getAreaById(id) {
    const area = await this.prisma.area.findUnique({
      where: { id },
    //   include: {
    //     district: true,
    //   },
    });

    if (!area) {
      throw new Error("Area not found");
    }

    return area;
  }

  async updateArea(id, data) {
    const updatedArea = await this.prisma.area.update({
      where: { id },
      data,
    });

    return updatedArea;
  }

  async deleteArea(id) {
    await this.prisma.area.delete({
      where: { id },
    });

    return { message: "Area deleted successfully" };
  }

  async areaByDistrict(id){
    return await this.prisma.area.findMany({
       where:{
        districtId:id
       }
        });
  }
}

module.exports = AreaService;

const { PrismaClient } = require("@prisma/client");

class DistrictService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  // Create a new District
  async createDistrict(data) {
    try {
      const District = await this.prisma.district.create({
        data,
      });
      return District;
    } catch (error) {
      throw new Error("Error creating District: " + error.message);
    }
  }

  // Get all cities
  async getAllDistricts() {
    try {
      const cities = await this.prisma.district.findMany();
      return cities;
    } catch (error) {
      throw new Error("Error fetching cities: " + error.message);
    }
  }

  // Get a single District by ID
  async getDistrictById(id) {
    try {
      const District = await this.prisma.district.findUnique({
        where: { id },
      });
      return District;
    } catch (error) {
      throw new Error("Error fetching District: " + error.message);
    }
  }

  // Update a District's data
  async updateDistrict(id, data) {
    try {
      const District = await this.prisma.district.update({
        where: { id },
        data,
      });
      return District;
    } catch (error) {
      throw new Error("Error updating District: " + error.message);
    }
  }

  // Delete a District
  async deleteDistrict(id) {
    try {
      const District = await this.prisma.district.delete({
        where: { id },
      });
      return District;
    } catch (error) {
      throw new Error("Error deleting District: " + error.message);
    }
  }


  async districtByDivision(id){
    try {

      const divisionId=parseInt(id)
      const cities = await this.prisma.district.findMany(
        {
          where:{
            division_id:divisionId
          }
        }
      );
      return cities;
    } catch (error) {
      throw new Error("Error fetching cities: " + error.message);
    }
  }
}

module.exports = DistrictService;

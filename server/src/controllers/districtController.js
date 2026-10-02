
class DistrictController {
  constructor(districtService) {
    this.districtService = districtService
  }

  // Create a District
  async createDistrict(req, res, next) {
    try {
      const District = await this.districtService.createDistrict(req.body);
      res.status(201).json({
        success: true,
        message: 'District created successfully',
        data: District,
      });
    } catch (error) {
      next(error); // Pass errors to Express error-handling middleware
    }
  }

  // Get all cities
  async getAllDistricts(req, res, next) {
    try {
      const cities = await this.districtService.getAllDistricts();
      res.status(200).json({
        success: true,
        data: cities,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get a District by ID
  async getDistrictById(req, res, next) {
    try {
      const District = await this.districtService.getDistrictById(req.params.id);
      if (!District) {
        return res.status(404).json({
          success: false,
          message: 'District not found',
        });
      }
      res.status(200).json({
        success: true,
        data: District,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update a District
  async updateDistrict(req, res, next) {
    try {
      const District = await this.districtService.updateDistrict(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'District updated successfully',
        data: District,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete a District
  async deleteDistrict(req, res, next) {
    try {
      const District = await this.districtService.deleteDistrict(req.params.id);
      res.status(200).json({
        success: true,
        message: 'District deleted successfully',
        data: District,
      });
    } catch (error) {
      next(error);
    }
  }

  async districtByDivision(req,res,next){
    try {
      const cities = await this.districtService.districtByDivision(req.params.id);
      res.status(200).json({
        success: true,
        data: cities,
      });
    } catch (error) {
      next(error);
    }

  }
}

module.exports = DistrictController;

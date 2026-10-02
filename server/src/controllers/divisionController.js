class DivisionController {
    constructor(divisionService) {
      this.divisionService = divisionService;
    }
  
    async createDivision(req, res, next) {
      try {
        const result = await this.divisionService.createDivision(req.body);
        res.status(201).json({
          success: true,
          message: 'Division created successfully',
          data: result,
        });
      } catch (error) {
        next(error); // Pass error to the global error handler
      }
    }
  
    async getAllDivisions(req, res, next) {
      try {
        const result = await this.divisionService.getAllDivisions();
        res.status(200).json({
          success: true,
          message: 'All divisions fetched successfully',
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  
    async getDivisionById(req, res, next) {
      try {
        const result = await this.divisionService.getDivisionById(req.params.id);
        res.status(200).json({
          success: true,
          message: 'Division fetched successfully',
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  
    async updateDivision(req, res, next) {
      try {
        const result = await this.divisionService.updateDivision(req.params.id, req.body);
        res.status(200).json({
          success: true,
          message: 'Division updated successfully',
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  
    async deleteDivision(req, res, next) {
      try {
        await this.divisionService.deleteDivision(req.params.id);
        res.status(200).json({
          success: true,
          message: 'Division deleted successfully',
        });
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = DivisionController;
  
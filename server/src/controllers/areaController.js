class AreaController {
    constructor(areaService) {
      this.areaService = areaService;
    }
  
    async createArea(req, res, next) {
      try {
        const result = await this.areaService.createArea(req.body);
        res.status(201).json({
          success: true,
          message: "Area created successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  
    async getAllAreas(req, res, next) {
      try {
        const result = await this.areaService.getAllAreas();
        res.status(200).json({
          success: true,
          message: "All areas fetched successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  
    async getAreaById(req, res, next) {
      try {
        const result = await this.areaService.getAreaById(req.params.id);
        res.status(200).json({
          success: true,
          message: "Area fetched successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  
    async updateArea(req, res, next) {
      try {
        const result = await this.areaService.updateArea(req.params.id, req.body);
        res.status(200).json({
          success: true,
          message: "Area updated successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  
    async deleteArea(req, res, next) {
      try {
        await this.areaService.deleteArea(req.params.id);
        res.status(200).json({
          success: true,
          message: "Area deleted successfully",
        });
      } catch (error) {
        next(error);
      }
    }

    async areaByDistrict(req,res,next){
        try {
            const result = await this.areaService.areaByDistrict(req.params.id);
            res.status(200).json({
              success: true,
              message: "All areas fetched successfully",
              data: result,
            });
          } catch (error) {
            next(error);
          }
    }
  }
  
  module.exports = AreaController;
  
const ResponseHandler = require("../shared/response.handaler")

class HotelController{
    constructor(hotelService){
        this.hotelService=hotelService
    }
    async createHotel(req,res,next){
        try{
            const result=await this.hotelService.createHotel(req.body)


            ResponseHandler.success(res,"Hotel created successfully",result,201)
           
        }catch(error){
            next(error)
        }
    }
    async getAllHotels(req,res,next){
        try{

            const {
                name = '',
                divisionId = '',
                cityId = '',
                minPrice=0,
                maxPrice=0
                // lastId = '',
                
            } = req.query;



            const result=await this.hotelService.getAllHotels({
                name: name.trim() || null,
                divisionId: divisionId || null,
                cityId: cityId || null,
                minPrice:parseInt(minPrice),
                maxPrice:parseInt(maxPrice)
                // lastId: lastId || null,
                // take: parseInt(limit)
            })
            ResponseHandler.success(res,"Hotels fetched successfully",result)
        }catch(error){
            next(error)
        }
    }
    async getSingleHotel(req,res,next){
        try{
            const hotelId=req.params.id
            const result=await this.hotelService.getSingleHotel(hotelId)
            ResponseHandler.success(res,`Hotel with ID ${hotelId} fetched successfully`,result)
        }catch(error){
            next(error)
        }
    }
    async updateHotel(req,res,next){
        try{
            const hotelId=req.params.id
            const result=await this.hotelService.updateHotel(hotelId,req.body)
            ResponseHandler.success(res,`Hotel with ID ${hotelId} updated successfully`,result) 
        }catch(error){
            next(error)
        }
    }
    async deleteHotel(req,res,next){
        try{
            const hotelId=req.params.id
            await this.hotelService.deleteHotel(hotelId)
            ResponseHandler.success(res,`Hotel with ID ${hotelId} deleted successfully`)
        }catch(error){
            next(error)
        }
    }

    async getHotelByDivision(req,res,next){
        try {
            const divisionId = req.params.divisionId

            const result=await this.hotelService.getHotelByDivision(divisionId)
            ResponseHandler.success(res,`Hotel with ID ${divisionId} fetched successfully`,result)

            
        } catch (error) {
            next(error)
            
        }
    }

    async getHotelByArea(req,res,next){
        try {
            const areaId = req.params.areaId

            const result=await this.hotelService.getHotelByArea(areaId)
            ResponseHandler.success(res,`Hotel with ID ${areaId} fetched successfully`,result)

            
        } catch (error) {
            next(error)
            
        }
    }


}
module.exports=HotelController
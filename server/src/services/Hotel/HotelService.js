class HotelService {
    constructor(prismaClient) {
        this.prisma = prismaClient;
    }
    async createHotel(data) {
        const hotel = await this.prisma.hotel.create({
            data
        })
        return hotel;
    }
    async getAllHotels({ name, divisionId, cityId,minPrice,maxPrice }) {

   
        

        let whereCondition = {
            isActive: true
        }
        if (name) {
            whereCondition.name = {
                contains: name,
                mode: 'insensitive'
            }
        }

        if(divisionId)
        {
            whereCondition.divisionId=divisionId
        }
        if(cityId)
        {
            whereCondition.cityId=cityId
        }
        return await this.prisma.hotel.findMany({
            where: whereCondition,
            orderBy: { id: 'asc' },
            include:{
            
                    rooms: {
                        where: {
                            isAvailable: true,
                            price: {
                                gte: minPrice, 
                                lte: maxPrice || Number.MAX_VALUE, 
                            },
                            // capacity: {
                            //     gte: minCapacity || 0, 
                            //     lte: maxCapacity || Number.MAX_VALUE, 
                            // },
                        }        
            }
        }
        });
    }
    async getSingleHotel(hotelId) {
        const hotel = await this.prisma.hotel.findUnique({
            where: { id: hotelId },
        });
        return hotel;
    }
    async updateHotel(hotelId, data) {
        const updatedHotel = await this.prisma.hotel.update({
            where: { id: hotelId },
            data,
        });
        return updatedHotel;
    }
    async deleteHotel(hotelId) {
        return await this.prisma.hotel.delete({
            where: { id: hotelId },
        });
    }

    async getHotelByDivision(divisionId){
        const hotel = await this.prisma.hotel.findUnique({
            where: { divisionId: divisionId },
        });
        return hotel;
    }

    async getHotelByArea(areaId){

       
        const hotel = await this.prisma.hotel.findMany({
            where: { areaId: areaId },
        });
        return hotel;
    }
}

module.exports = HotelService
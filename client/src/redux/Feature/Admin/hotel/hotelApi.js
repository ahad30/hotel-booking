import baseApi from '../../../Api/baseApi';

const hotelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Hotel
    createHotel: builder.mutation({
      query: (data) => ({
        url: "/hotel/create",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['hotels']
    }),

    // Get All Hotels
    getHotel: builder.query({
      query: () => ({
        url: "/hotel",
      }),
      providesTags: ['hotels']
    }),

    // Get Hotels with search, and filtering
    getHotelsBySearch: builder.query({
      query: ({ 
        name = '',
        divisionId = '',
        cityId = ''
      
      }) => ({
        url: "/hotel",
        params: {
          name,
          divisionId,
          cityId,

         
        },
      }),
      providesTags: ['hotels']
    }),

    // Get Hotel by Id
    getHotelById: builder.query({
      query: (id) => ({
        url: `/hotel/${id}`,
      }),
      providesTags: ['hotels']
    }),

    // Get Nearby Hotels
    getHotelByArea: builder.query({
      query: (areaId) => ({
        url: `/hotel/${areaId}/area`,
      }),
      providesTags: ['hotels']
    }),

    // Update Hotel
    updateHotel: builder.mutation({
      query: ({ id, data }) => ({
        url: `/hotel/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['hotels']
    }),

    // Delete Hotel
    deleteHotel: builder.mutation({
      query: (id) => ({
        url: `/hotel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['hotels']
    }),
  }),
});

export const {
  useCreateHotelMutation,
  useGetHotelQuery,
  useGetHotelsBySearchQuery,
  useGetHotelByIdQuery,
  useGetHotelByAreaQuery,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelApi;

export default hotelApi;
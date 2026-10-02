import baseApi from '../../../Api/baseApi';

const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Room
    createRoom: builder.mutation({
      query: (data) => ({
        url: "/room/create",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['rooms']
    }),

    // Get All Rooms
    getRoom: builder.query({
      query: () => ({
        url: "/room",
      }),
      providesTags: ['rooms']
    }),

    // Get Rooms by Hotel ID
    getRoomsByHotelId: builder.query({
      query: (hotelId) => ({
        url: `/hotel/${hotelId}/rooms`,
      }),
      providesTags: ['rooms']
      
    }),

    // Get Room by Id
    getRoomById: builder.query({
      query: (id) => ({
        url: `/room/${id}`,
      }),
      providesTags: ['rooms']
    }),

    // Update Room
    updateRoom: builder.mutation({
      query: ({ id, data }) => ({
        url: `/room/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['rooms']
    }),

    // Delete Room
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `/room/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['rooms']
    }),

    checkRoomAvailability: builder.mutation({
      query: ({ roomId, checkIn, checkOut }) => ({
        url: `/room/checkAvailability`,
        method: "POST",
        body: { roomId, checkIn, checkOut }
      })
    })
  }),
});

export const {
  useCreateRoomMutation,
  useGetRoomQuery,
  useGetRoomsByHotelIdQuery,
  useGetRoomByIdQuery,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useCheckRoomAvailabilityMutation,
} = roomApi;

export default roomApi;
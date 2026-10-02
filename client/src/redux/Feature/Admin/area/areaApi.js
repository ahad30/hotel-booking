import baseApi from '../../../Api/baseApi';

const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Create Area
    createArea: builder.mutation({
      query: (data) => ({
        url: "/area/create",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ['area'],
    }),

    // Get All Areas
    getAreas: builder.query({
      query: () => ({
        url: "/area",
        method: "GET",
      }),
      providesTags: ['area'],
    }),

    // Get Area by ID
    getAreaById: builder.query({
      query: (id) => ({
        url: `/area/${id}`,
        method: "GET",
      }),
      providesTags: ['area'],
    }),

    // Update Area
    updateArea: builder.mutation({
      query: ({ id, data }) => ({
        url: `/area/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ['area'],
    }),

    // Delete Area
    deleteArea: builder.mutation({
      query: (id) => ({
        url: `/area/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['area'],
    }),

  }),
});

export const {
  useCreateAreaMutation,
  useGetAreasQuery,
  useGetAreaByIdQuery,
  useUpdateAreaMutation,
  useDeleteAreaMutation
} = bookingApi;

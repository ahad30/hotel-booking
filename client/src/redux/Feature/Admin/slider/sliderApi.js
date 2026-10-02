import baseApi from '../../../Api/baseApi';

const sliderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add Slider
    addSlider: builder.mutation({
      query: (data) => ({
        url: "/sliders/create",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['sliders'], // Invalidates sliders cache
    }),

    // Get Sliders
    getSliders: builder.query({
      query: () => ({
        url: "/sliders",
      }),
      providesTags: ['sliders'], // Provides sliders cache
    }),

    // Update Slider
    updateSlider: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sliders/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['sliders'], // Invalidates sliders cache
    }),

    // Delete Slider
    deleteSlider: builder.mutation({
      query: (id) => ({
        url: `/sliders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['sliders'], // Invalidates sliders cache
    }),
  }),
});

export const {
  useAddSliderMutation,
  useGetSlidersQuery,
  useUpdateSliderMutation,
  useDeleteSliderMutation,
} = sliderApi;

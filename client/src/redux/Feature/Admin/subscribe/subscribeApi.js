import baseApi from '../../../Api/baseApi';

const subscribeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add Subscription
    addSubscription: builder.mutation({
      query: (data) => ({
        url: "/subscribe/create",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['subscriptions'], // Invalidates subscription cache
    }),

    // Get All Subscriptions
    getSubscriptions: builder.query({
      query: () => ({
        url: "/subscriptions",
      }),
      providesTags: ['subscriptions'], // Provides subscription cache
    }),

    // Get Subscription by Email
    getSubscriptionByEmail: builder.query({
      query: (email) => ({
        url: `/subscriptions/${email}`,
      }),
      providesTags: ['subscriptions'], // Provides subscription cache
    }),

    // Delete Subscription by Email
    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `/subscribe/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['subscriptions'], // Invalidates subscription cache
    }),
  }),
});

export const {
  useAddSubscriptionMutation,
  useGetSubscriptionsQuery,
  useGetSubscriptionByEmailQuery,
  useDeleteSubscriptionMutation,
} = subscribeApi;

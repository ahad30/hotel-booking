import baseApi from '../../../Api/baseApi';

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Notification
    createNotification: builder.mutation({
      query: (data) => ({
        url: "/notification/create",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['notification'],
    }),

    // Get User's Notifications
    getUserNotifications: builder.query({
      query: (userId) => ({
        url: `/notification/${userId}`,
      }),
      providesTags: ['notification'],
    }),

    // Mark Notification as Read
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/notification/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ['notification'],
    }),


  }),
});

export const {
  useCreateNotificationMutation,
  useGetUserNotificationsQuery,
  useMarkNotificationAsReadMutation,
//   useGetUnreadNotificationsCountQuery,
} = notificationApi;

export default notificationApi;
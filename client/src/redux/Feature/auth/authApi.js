import baseApi from '../../Api/baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (data) => ({
        url: "/user/login",
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST",
        body: data,
      }),
    }),

    // Register a new user
    register: builder.mutation({
      query: (data) => ({
        url: "/user/register",
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['users'],
    }),

    // Get all users
    getUser: builder.query({
      query: () => ({
        url: "/user",
      }),
      providesTags: ['users'],
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
      }),
      providesTags: ['users'],
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        headers: {
          'Content-Type': 'application/json',
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['users'],
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['users'],
    }),

    // Verify email
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: `/users/verify/${token}`,
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetUserQuery, 
  useGetUserByIdQuery, 
  useUpdateUserMutation, 
  useDeleteUserMutation,
  useVerifyEmailMutation 
} = authApi;
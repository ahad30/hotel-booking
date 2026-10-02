import baseApi from '../../../Api/baseApi';

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add Contact
    addContact: builder.mutation({
      query: (data) => ({
        url: "/contact/create",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['contact'], // Invalidates contact cache
    }),

    // Get Contacts
    getContacts: builder.query({
      query: () => ({
        url: "/contact",
      }),
      providesTags: ['contact'], // Provides contact cache
    }),

    // Get Contact by ID
    getContactById: builder.query({
      query: (id) => ({
        url: `/contact/${id}`,
      }),
      providesTags: ['contact'],
    }),

    // Update Contact
    updateContact: builder.mutation({
      query: ({ id, data }) => ({
        url: `/contact/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['contact'], // Invalidates contact cache
    }),

    // Delete Contact
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['contact'], // Invalidates contact cache
    }),
  }),
});

export const {
  useAddContactMutation,
  useGetContactsQuery,
  useGetContactByIdQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactApi;

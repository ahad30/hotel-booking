
import baseApi from "@/redux/Api/baseApi";
import { getTagsByModuleName } from "@/redux/Tag/Tag";

const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Add Customer
    addCustomer: builder.mutation({
      query: (data) => ({
        url: "/customers/create",
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: getTagsByModuleName('Customer')
    }),

    // Get Customers
    getCustomers: builder.query({
      query: () => ({
        url: "/customers",
      }),
      providesTags: getTagsByModuleName('Customer')
    }),

    // Update Customer
    updateCustomer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/customers/update/${id}`,
        headers: {
          'Content-Type': 'application/json',
        },
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: getTagsByModuleName('Customer')
    }),

    // Delete Customer
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/customers/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: getTagsByModuleName('Customer')
    }),

  }),
});

export const { 
  useAddCustomerMutation,
  useGetCustomersQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi;

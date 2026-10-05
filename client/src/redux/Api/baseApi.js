import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../Feature/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  // Every request carries the signed-in user's token; the API checks it.
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// An expired or invalid token ends the session cleanly instead of leaving the
// app half signed-in; route guards then send the user to /login.
const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && api.getState()?.auth?.token) {
    api.dispatch(logout());
    api.dispatch(baseApi.util.resetApiState());
  }
  return result;
};

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  endpoints: () => ({}),
  tagTypes: [
    "rooms",
    "users",
    "hotels",
    "sliders",
    "customers",
    "subscriptions",
    "orders",
    "contact",
    "booking",
    "notification",
    "division",
    "district",
    "area",
  ],
});

export default baseApi;

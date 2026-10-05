import baseApi from "../../Api/baseApi";

const assistantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Natural-language trip search: { query } -> interpreted filters + matching hotels
    assistantSearch: builder.mutation({
      query: (query) => ({
        url: "/assistant/search",
        method: "POST",
        body: { query },
      }),
    }),
  }),
});

export const { useAssistantSearchMutation } = assistantApi;

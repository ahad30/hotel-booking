import baseApi from '../../../Api/baseApi';

const placeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Division endpoints
    getDivisions: builder.query({
      query: () => ({
        url: "/division",
      }),
      providesTags: ['division'],
    }),

    // District endpoints
    getDistricts: builder.query({
      query: () => ({
        url: "/district",
      }),
      providesTags: ['district'],
    }),

    getDistrictsByDivision: builder.query({
      query: (divisionId) => ({
        url: `/district/by-division/${divisionId}`,
      }),
      providesTags: ['district'],
    }),


    getAreasByDistrict: builder.query({
      query: (districtId) => ({
        url: `/area/by-district/${districtId}`,
      }),
      providesTags: ['area'],
    }),
  }),
});

export const {

  useGetDivisionsQuery,
  useGetDistrictsQuery,
  useGetDistrictsByDivisionQuery,
  useGetAreasByDistrictQuery
} = placeApi;
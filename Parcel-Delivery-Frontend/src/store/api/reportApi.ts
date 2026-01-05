import { apiSlice } from "./apiSlice";

export const reportApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getParcelStats: builder.query<any, string>({
            query: (timeframe) => `/parcel/stats?timeframe=${timeframe}`,
            keepUnusedDataFor: 0,
        }),
    }),
    overrideExisting: false,
});

export const { useGetParcelStatsQuery } = reportApi;

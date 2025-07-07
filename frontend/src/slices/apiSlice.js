import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../constants.js';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',

  // ✅ Automatically attach token to protected requests
  prepareHeaders: (headers, { getState }) => {
    const userInfo = getState().auth?.userInfo;

    if (userInfo?.token) {
      headers.set('Authorization', `Bearer ${userInfo.token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});

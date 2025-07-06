import { apiSlice } from "./apiSlice";
import { PRODUCTS_URL } from "../../constants";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Fetch all products
    getProducts: builder.query({
      query: ({keyword,pageNumber}) => ({
        url: PRODUCTS_URL,
        params:{
          pageNumber,
          keyword
        }
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),

    // ✅ Fetch product by ID
    getProductById: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // ✅ Create product
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: 'POST',
        body: {}, // sample product
      }),
      invalidatesTags: ['Products'],
    }),

    // ✅ Update product
    updateProduct: builder.mutation({
      query: ({ productId, updatedData }) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['Products'],
    }),

    // ✅ Upload image
    uploadImage: builder.mutation({
      query: (data) => ({
        url: '/api/upload',
        method: 'POST',
        body: data,
      }),
    }),

    // ✅ Delete product
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

    // ✅ Create review
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data, // { rating, comment }
      }),
      invalidatesTags: ['Products'],
    }),
    getTopProducts:builder.query({
      query:()=>({
        url:`${PRODUCTS_URL}/top`
      })
    })
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation, 
  useGetTopProductsQuery// 🧪 Add this line!
} = productsApiSlice;

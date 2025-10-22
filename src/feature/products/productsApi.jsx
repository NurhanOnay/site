import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// DummyJSON için ana API'mizi oluşturuyoruz
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  tagTypes: ['Product'], // Cache etiketlemesi için
  
  // Endpoints: CRUD işlemlerinin tamamı
  endpoints: (builder) => ({
    
    // 1. Get All Products (READ)
    getProducts: builder.query({
      query: () => 'products',
      providesTags: ['Product'], // Bu sorgunun 'Product' etiketli veriyi çektiğini belirtir
    }),
    
    // 2. Get Single Product (READ)
    getProductById: builder.query({
      query: (id) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    // 3. Add New Product (CREATE)
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: 'products/add',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: newProduct,
      }),
      invalidatesTags: ['Product'], // 'Product' etiketli cache'i geçersiz kılar (listeyi yeniler)
    }),
    
    // 4. Update Product (UPDATE)
    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `products/${id}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, 'Product'],
    }),

    // 5. Delete Product (DELETE)
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

// Oluşturulan hook'ları otomatik olarak dışa aktar
// Hata veren tüm dosyalar (ProductsPage, ProductFormPage, vb.)
// bu hook'ları kullanmaya çalışıyor:
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// DummyJSON için ana API'mizi oluşturuyoruz
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  tagTypes: ['Product', 'User','Comment'], // 'User' cache etiketi eklendi
  
  // Endpoints: CRUD işlemlerinin tamamı
  endpoints: (builder) => ({
    
    // --- ÜRÜN ENDPOINTLERİ (Aynı kalır) ---
    getProducts: builder.query({
      query: () => 'products',
      providesTags: ['Product'],
    }),
    
    getProductById: builder.query({
      query: (id) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: 'products/add',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: newProduct,
      }),
      invalidatesTags: ['Product'], 
    }),
    
    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `products/${id}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, 'Product'],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // 6. Get All Comments (READ)
    getComments: builder.query({
      query: () => 'comments',
      providesTags: ['Comment'],
    }),

    // 7. Get Comments by Product ID (READ)
    getCommentsByProduct: builder.query({
      // DÜZELTME: comments/post/ ifadesinin başında ve sonunda ters tırnak olmalı
      query: (productId) => `comments/post/${productId}`, 
      providesTags: (result, error, productId) => [{ type: 'Comment', productId }],
    }),

    // --- YENİ KULLANICI ENDPOINT'İ (Admin Paneli İçin) ---
    getUsers: builder.query({
      query: () => 'users', // DummyJSON'daki users endpoint'ine istek atar
      providesTags: ['User'], // Bu sorgunun 'User' etiketli veriyi çektiğini belirtir
      transformResponse: (response) => {
        // Gelen kullanıcı verisine rolleri ve mock durumlarını atıyoruz
        const usersWithRoles = response.users.map((u, i) => ({
            ...u,
            // Admin (0, 3, 6...), Moderator (1, 4, 7...), User (2, 5, 8...)
            role: i % 3 === 0 ? "admin" : (i % 3 === 1 ? "moderator" : "user"),
            isBlocked: i % 5 === 0, // Mock engellenmiş durum
            createdAt: new Date(Date.now() - (i * 86400000)).toLocaleDateString(), // Mock kayıt tarihi
        }));
        return usersWithRoles;
      },
    }),
    // Bu yapı içinde Mock Silme/Engelleme mutasyonları da tanımlanabilir
  }),
});

// Oluşturulan hook'ları otomatik olarak dışa aktar
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetUsersQuery, // <-- YENİ: Kullanıcıları çekme hook'u
  useGetCommentsQuery,
  useGetCommentsByProductQuery,
} = productsApi;
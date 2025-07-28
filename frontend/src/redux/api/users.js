// import { apiSlice } from "./apiSlice";
// import { USERS_URL } from "../constants";

// export const apiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     login: builder.mutation({
//       query: (data) => ({
//         url: `${USERS_URL}/auth`,
//         method: "POST",
//         body: data,
//       }),
//     }),

//     register: builder.mutation({
//       query: (data) => ({
//         url: `${USERS_URL}`,
//         method: "POST",
//         body: data,
//       }),
//     }),

//     logout: builder.mutation({
//       query: () => ({
//         url: `${USERS_URL}/logout`,
//         method: "POST",
//       }),
//     }),

//     profile: builder.mutation({
//       query: (data) => ({
//         url: `${USERS_URL}/profile`,
//         method: "PUT",
//         body: data,
//       }),
//     }),

//     getUsers: builder.query({
//       query: () => ({
//         url: USERS_URL,
//       }),
//     }),
//   }),
// });

// export const {
//   useLoginMutation,
//   useRegisterMutation,
//   useLogoutMutation,
//   useProfileMutation,
//   useGetUsersQuery,
// } = apiSlice;


import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    getProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "GET",
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),

    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUsersQuery,
} = usersApiSlice;

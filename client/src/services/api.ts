import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";
import {
  AdminUser,
  BeforeAfterItem,
  Booking,
  GalleryItem,
  LocationItem,
  Overview,
  Review,
  Service,
  SiteSettings,
  SocialPost,
} from "@/types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Service", "Booking", "Gallery", "BeforeAfter", "Review", "Location", "SocialPost", "Settings", "Overview"],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<{ token: string; admin: AdminUser }, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    getMe: builder.query<AdminUser, void>({
      query: () => "/auth/me",
    }),

    // Services
    getServices: builder.query<Service[], void>({
      query: () => "/services",
      providesTags: (result) =>
        result
          ? [...result.map((s) => ({ type: "Service" as const, id: s.id })), { type: "Service", id: "LIST" }]
          : [{ type: "Service", id: "LIST" }],
    }),
    createService: builder.mutation<Service, Partial<Service>>({
      query: (body) => ({ url: "/services", method: "POST", body }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),
    updateService: builder.mutation<Service, { id: string; body: Partial<Service> }>({
      query: ({ id, body }) => ({ url: `/services/${id}`, method: "PUT", body }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),
    deleteService: builder.mutation<void, string>({
      query: (id) => ({ url: `/services/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),

    // Bookings
    getBookings: builder.query<Booking[], Record<string, string> | void>({
      query: (params) => ({ url: "/bookings", params: params ?? undefined }),
      providesTags: [{ type: "Booking", id: "LIST" }],
    }),
    createBooking: builder.mutation<Booking, Record<string, unknown>>({
      query: (body) => ({ url: "/bookings", method: "POST", body }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }, "Overview"],
    }),
    updateBookingStatus: builder.mutation<Booking, { id: string; status: string; internalNotes?: string }>({
      query: ({ id, ...body }) => ({ url: `/bookings/${id}/status`, method: "PUT", body }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }, "Overview"],
    }),
    deleteBooking: builder.mutation<void, string>({
      query: (id) => ({ url: `/bookings/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }, "Overview"],
    }),

    // Gallery
    getGalleryItems: builder.query<GalleryItem[], string | void>({
      query: (category) => ({ url: "/gallery", params: category ? { category } : undefined }),
      providesTags: [{ type: "Gallery", id: "LIST" }],
    }),
    createGalleryItem: builder.mutation<GalleryItem, Partial<GalleryItem>>({
      query: (body) => ({ url: "/gallery", method: "POST", body }),
      invalidatesTags: [{ type: "Gallery", id: "LIST" }],
    }),
    updateGalleryItem: builder.mutation<GalleryItem, { id: string; body: Partial<GalleryItem> }>({
      query: ({ id, body }) => ({ url: `/gallery/${id}`, method: "PUT", body }),
      invalidatesTags: [{ type: "Gallery", id: "LIST" }],
    }),
    deleteGalleryItem: builder.mutation<void, string>({
      query: (id) => ({ url: `/gallery/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Gallery", id: "LIST" }],
    }),

    // Before/After
    getBeforeAfterItems: builder.query<BeforeAfterItem[], void>({
      query: () => "/before-after",
      providesTags: [{ type: "BeforeAfter", id: "LIST" }],
    }),
    createBeforeAfterItem: builder.mutation<BeforeAfterItem, Partial<BeforeAfterItem>>({
      query: (body) => ({ url: "/before-after", method: "POST", body }),
      invalidatesTags: [{ type: "BeforeAfter", id: "LIST" }],
    }),
    updateBeforeAfterItem: builder.mutation<BeforeAfterItem, { id: string; body: Partial<BeforeAfterItem> }>({
      query: ({ id, body }) => ({ url: `/before-after/${id}`, method: "PUT", body }),
      invalidatesTags: [{ type: "BeforeAfter", id: "LIST" }],
    }),
    deleteBeforeAfterItem: builder.mutation<void, string>({
      query: (id) => ({ url: `/before-after/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "BeforeAfter", id: "LIST" }],
    }),

    // Reviews
    getReviews: builder.query<Review[], void>({
      query: () => "/reviews",
      providesTags: [{ type: "Review", id: "LIST" }],
    }),
    createReview: builder.mutation<Review, Partial<Review>>({
      query: (body) => ({ url: "/reviews", method: "POST", body }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),
    updateReview: builder.mutation<Review, { id: string; body: Partial<Review> }>({
      query: ({ id, body }) => ({ url: `/reviews/${id}`, method: "PUT", body }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),
    deleteReview: builder.mutation<void, string>({
      query: (id) => ({ url: `/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),

    // Locations
    getLocations: builder.query<LocationItem[], void>({
      query: () => "/locations",
      providesTags: [{ type: "Location", id: "LIST" }],
    }),
    createLocation: builder.mutation<LocationItem, Partial<LocationItem>>({
      query: (body) => ({ url: "/locations", method: "POST", body }),
      invalidatesTags: [{ type: "Location", id: "LIST" }],
    }),
    updateLocation: builder.mutation<LocationItem, { id: string; body: Partial<LocationItem> }>({
      query: ({ id, body }) => ({ url: `/locations/${id}`, method: "PUT", body }),
      invalidatesTags: [{ type: "Location", id: "LIST" }],
    }),
    deleteLocation: builder.mutation<void, string>({
      query: (id) => ({ url: `/locations/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Location", id: "LIST" }],
    }),

    // Social posts
    getSocialPosts: builder.query<SocialPost[], void>({
      query: () => "/social-posts",
      providesTags: [{ type: "SocialPost", id: "LIST" }],
    }),
    createSocialPost: builder.mutation<SocialPost, Partial<SocialPost>>({
      query: (body) => ({ url: "/social-posts", method: "POST", body }),
      invalidatesTags: [{ type: "SocialPost", id: "LIST" }],
    }),
    updateSocialPost: builder.mutation<SocialPost, { id: string; body: Partial<SocialPost> }>({
      query: ({ id, body }) => ({ url: `/social-posts/${id}`, method: "PUT", body }),
      invalidatesTags: [{ type: "SocialPost", id: "LIST" }],
    }),
    deleteSocialPost: builder.mutation<void, string>({
      query: (id) => ({ url: `/social-posts/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "SocialPost", id: "LIST" }],
    }),

    // Settings
    getSettings: builder.query<SiteSettings, void>({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation<SiteSettings, Partial<SiteSettings>>({
      query: (body) => ({ url: "/settings", method: "PUT", body }),
      invalidatesTags: ["Settings"],
    }),

    // Overview
    getOverview: builder.query<Overview, void>({
      query: () => "/overview",
      providesTags: ["Overview"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
  useGetGalleryItemsQuery,
  useCreateGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
  useGetBeforeAfterItemsQuery,
  useCreateBeforeAfterItemMutation,
  useUpdateBeforeAfterItemMutation,
  useDeleteBeforeAfterItemMutation,
  useGetReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetLocationsQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  useGetSocialPostsQuery,
  useCreateSocialPostMutation,
  useUpdateSocialPostMutation,
  useDeleteSocialPostMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetOverviewQuery,
} = api;

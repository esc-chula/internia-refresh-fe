import { apiFetch } from "./client";
import type { Review, ReviewListResponse, ReviewPayload } from "./types";

export function listReviews(params: { q?: string; page?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return apiFetch<ReviewListResponse>(`/reviews${qs ? `?${qs}` : ""}`, { auth: true });
}

export function listCompanyReviews(slug: string, params: { page?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return apiFetch<ReviewListResponse>(`/companies/${encodeURIComponent(slug)}/reviews${qs ? `?${qs}` : ""}`, {
    auth: true,
  });
}

export function createReview(companySlug: string, payload: ReviewPayload) {
  return apiFetch<Review>(`/companies/${encodeURIComponent(companySlug)}/reviews`, {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export function getReview(reviewId: string) {
  return apiFetch<Review>(`/reviews/${encodeURIComponent(reviewId)}`, { auth: true });
}

export function updateReview(reviewId: string, payload: ReviewPayload) {
  return apiFetch<Review>(`/reviews/${encodeURIComponent(reviewId)}`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });
}

export function deleteReview(reviewId: string) {
  return apiFetch<{ ok: boolean }>(`/reviews/${encodeURIComponent(reviewId)}`, { method: "DELETE", auth: true });
}

export function likeReview(reviewId: string) {
  return apiFetch<{ ok: boolean }>(`/reviews/${encodeURIComponent(reviewId)}/like`, { method: "PUT", auth: true });
}

export function unlikeReview(reviewId: string) {
  return apiFetch<{ ok: boolean }>(`/reviews/${encodeURIComponent(reviewId)}/like`, { method: "DELETE", auth: true });
}

export function listMyReviews() {
  return apiFetch<ReviewListResponse>("/me/reviews", { auth: true });
}

export function listLikedReviews() {
  return apiFetch<ReviewListResponse>("/me/liked-reviews", { auth: true });
}

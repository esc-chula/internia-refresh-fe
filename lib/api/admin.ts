import { apiFetch } from "./client";
import type { AdminReviewListResponse, AdminUserListResponse, Role, User } from "./types";

export function listAdminUsers(page = 1, limit = 100) {
  return apiFetch<AdminUserListResponse>(`/admin/users?page=${page}&limit=${limit}`, { auth: true });
}

export function updateUserRole(userId: string, role: Role) {
  return apiFetch<User>(`/admin/users/${encodeURIComponent(userId)}/role`, {
    method: "PATCH",
    auth: true,
    body: { role },
  });
}

export function listAdminReviews(page = 1, limit = 300) {
  return apiFetch<AdminReviewListResponse>(`/admin/reviews?page=${page}&limit=${limit}`, { auth: true });
}

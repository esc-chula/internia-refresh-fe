import { apiFetch, apiFetchForm } from "./client";
import type { Company, CompanyListResponse } from "./types";

export type CompanyListParams = {
  q?: string;
  category?: string;
  sort?: "popular" | "rating" | "latest";
  page?: number;
  limit?: number;
};

export function listCompanies(params: CompanyListParams = {}) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return apiFetch<CompanyListResponse>(`/companies${qs ? `?${qs}` : ""}`);
}

export function getCompany(slug: string) {
  return apiFetch<Company>(`/companies/${encodeURIComponent(slug)}`);
}

export function createCompany(data: { name: string; category: string; logo?: File | null }) {
  const form = new FormData();
  form.set("name", data.name);
  form.set("category", data.category);
  if (data.logo) form.set("logo", data.logo);
  return apiFetchForm<Company>("/companies", form);
}

export function updateCompany(slug: string, data: { name: string; category: string; logo?: File | null }) {
  const form = new FormData();
  form.set("name", data.name);
  form.set("category", data.category);
  if (data.logo) form.set("logo", data.logo);
  return apiFetchForm<Company>(`/companies/${encodeURIComponent(slug)}`, form, "PATCH");
}

export function deleteCompany(slug: string) {
  return apiFetch<{ ok: boolean }>(`/companies/${encodeURIComponent(slug)}`, { method: "DELETE", auth: true });
}

export type User = {
  id: string;
  email: string;
  username: string | null;
  department: string | null;
  onboarded: boolean;
};

export type CompanyScores = {
  work: number;
  social: number;
  mentor: number;
  experience: number;
};

export type Company = {
  id: string;
  slug: string;
  name: string;
  category: string;
  logoUrl: string | null;
  rating: number;
  reviewCount: number;
  scores: CompanyScores;
  recommendationCount: number;
};

export type CompanyListResponse = {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
};

export type Reviewer = {
  username: string | null;
  department: string | null;
};

export type WorkMode = "Work from home" | "Hybrid" | "Onsite";

export type Review = {
  id: string;
  companySlug: string;
  reviewer: Reviewer;
  position: string;
  startDate: string;
  endDate: string;
  workMode: WorkMode;
  hasCompensation: boolean | null;
  compensationAmount: number | null;
  compensationUnit: string | null;
  hasYearLimit: boolean | null;
  acceptedYears: number[] | null;
  hasMinGpa: boolean | null;
  minGpa: number | null;
  applicationSection: string | null;
  workSection: string | null;
  atmosphereSection: string | null;
  welfareSection: string | null;
  adviceSection: string | null;
  workScore: number;
  socialScore: number;
  mentorScore: number;
  experienceScore: number;
  overallScore: number;
  recommended: boolean;
  anonymous: boolean;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
  canEdit: boolean;
};

export type ReviewListResponse = {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
};

export type ReviewPayload = {
  position: string;
  startDate: string;
  endDate: string;
  workMode: WorkMode;
  hasCompensation?: boolean;
  compensationAmount?: number;
  compensationUnit?: string;
  hasYearLimit?: boolean;
  acceptedYears?: number[];
  hasMinGpa?: boolean;
  minGpa?: number;
  applicationSection?: string;
  workSection?: string;
  atmosphereSection?: string;
  welfareSection?: string;
  adviceSection?: string;
  workScore: number;
  socialScore: number;
  mentorScore: number;
  experienceScore: number;
  overallScore: number;
  recommended: boolean;
  anonymous: boolean;
};

export type ApiErrorBody = {
  code: string;
  message: string;
  fields?: Record<string, string>;
};

export class ApiError extends Error {
  status: number;
  code: string;
  fields?: Record<string, string>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.status = status;
    this.code = body.code;
    this.fields = body.fields;
  }
}

import {
  ActivityLevel,
  Gender,
  ScanningMode,
  SkinType,
} from "../../../types/types";

export interface IAuthPayload {
  name: string;
  email: string;
  avatar: string;
}

export interface IOnboardingRequest {
  gender: Gender;
  age: number;
  preferredMode: ScanningMode;
}

export interface IUpdateProfileRequest {
  gender?: Gender;
  age?: number;
  height?: number;
  weight?: number;
  dob?: Date;
  preferredMode?: ScanningMode;
  skinType?: SkinType;
  skinConcerns?: string[];
  beautyGoals?: string[];
  activityLevel?: ActivityLevel;
  dietaryPreferences?: string[];
  allergies?: string[];
  healthGoals?: string[];
  metadata?: Record<string, any>;
}

export interface IUserResponse {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  gender?: Gender | null;
  age?: number | null;
  preferredMode: ScanningMode;
  isEmailVerified: boolean;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

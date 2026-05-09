export * from "@prisma/client";

export enum MealType {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  SNACK = "SNACK",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
}

export enum SkinType {
  OILY = "OILY",
  DRY = "DRY",
  COMBINATION = "COMBINATION",
  SENSITIVE = "SENSITIVE",
  NORMAL = "NORMAL",
}

export enum ActivityLevel {
  SEDENTARY = "SEDENTARY",
  LIGHTLY_ACTIVE = "LIGHTLY_ACTIVE",
  MODERATELY_ACTIVE = "MODERATELY_ACTIVE",
  VERY_ACTIVE = "VERY_ACTIVE",
  EXTRA_ACTIVE = "EXTRA_ACTIVE",
}

export enum ScanningMode {
  NUTRITION = "NUTRITION",
  BEAUTY = "BEAUTY",
}

export enum AuthProvider {
  GOOGLE = "GOOGLE",
  EMAIL = "EMAIL",
}

export interface User {
  id: bigint;
  email: string;
  name: string;
  avatar?: string | null;
  gender?: any | null;
  age?: number | null;
  dob?: Date | null;
  preferredMode: any;
  skinType?: any | null;
  skinConcerns: string[];
  beautyGoals: string[];
  height?: number | null;
  weight?: number | null;
  activityLevel?: any | null;
  dietaryPreferences: string[];
  allergies: string[];
  healthGoals: string[];
  provider: any;
  isEmailVerified: boolean;
  isProfileCompleted: boolean;
  isActive: boolean;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageType {
  publicId: string;
  url: string;
  [key: string]: any;
}

export const statusCodes = {
  SUCCESS: 200,
  CREATED: 201,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,

  CONFLICT: 409,
  TO_MANY_REQUESTS: 429,
  
  INTERNAL_SERVER_ERROR: 500,
};

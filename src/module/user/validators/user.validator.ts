import { z } from "zod";

export const updateProfileValidator = z.object({
  gender: z.nativeEnum({
    MALE: "MALE",
    FEMALE: "FEMALE",
    OTHER: "OTHER",
    PREFER_NOT_TO_SAY: "PREFER_NOT_TO_SAY",
  }).optional(),
  age: z.number().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  dob: z.date().optional(),
  preferredMode: z.nativeEnum({ NUTRITION: "NUTRITION", BEAUTY: "BEAUTY" }).optional(),
  skinType: z.nativeEnum({
    OILY: "OILY",
    DRY: "DRY",
    COMBINATION: "COMBINATION",
    SENSITIVE: "SENSITIVE",
    NORMAL: "NORMAL",
  }).optional(),
  skinConcerns: z.array(z.string()).optional(),
  beautyGoals: z.array(z.string()).optional(),
  activityLevel: z.nativeEnum({
    SEDENTARY: "SEDENTARY",
    LIGHTLY_ACTIVE: "LIGHTLY_ACTIVE",
    MODERATELY_ACTIVE: "MODERATELY_ACTIVE",
    VERY_ACTIVE: "VERY_ACTIVE",
    EXTRA_ACTIVE: "EXTRA_ACTIVE",
  }).optional(),
  dietaryPreferences: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  healthGoals: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

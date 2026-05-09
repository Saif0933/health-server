import { z } from "zod";
import { MealType } from "../types/types";

export const scanFoodSchema = z.object({
    image: z.string(),
    mealType: z.nativeEnum(MealType),
});

export type ScanFoodSchemaType = z.infer<typeof scanFoodSchema>;
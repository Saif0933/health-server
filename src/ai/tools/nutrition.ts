import { tool } from "langchain";
import { z } from "zod";
import { prisma } from "../../config/prisma";

export const getUserFoodScanHistory = tool(
  async ({ startDate, endDate }, config) => {
    console.log({config});
    const userId = config?.context?.userId;
    if (!userId) {
      throw new Error("userId not found in config.context");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const foodLogs = await prisma.nutritionLog.findMany({
      where: {
        userId: BigInt(userId),

        createdAt: {
          gte: start,
          lte: end,
        },
      },
      take: 20,
    });

    return foodLogs;
  },
  {
    name: "get_user_food_scan_history",
    description: "Get user food scan history based on start date and end date",
    schema: z.object({
      startDate: z.string().describe("ISO formatted start date string"),
      endDate: z.string().describe("ISO formatted end date string"),
    }),
  },
);


import { prisma } from "../../../../config/prisma";

/**
 * Creates or updates the active gym goal for a user.
 */
export const upsertGymGoal = async (userId: string, data: any) => {
  const { calorieTarget, proteinTarget, carbsTarget, fatsTarget, waterTarget } = data;

  // Find the current active goal
  const existingGoal = await prisma.gymGoal.findFirst({
    where: { userId, isActive: true },
  });

  if (existingGoal) {
    return await prisma.gymGoal.update({
      where: { id: existingGoal.id },
      data: {
        calorieTarget: calorieTarget ? Number(calorieTarget) : undefined,
        proteinTarget: proteinTarget ? Number(proteinTarget) : undefined,
        carbsTarget: carbsTarget ? Number(carbsTarget) : undefined,
        fatsTarget: fatsTarget ? Number(fatsTarget) : undefined,
        waterTarget: waterTarget ? Number(waterTarget) : undefined,
      },
    });
  }

  return await prisma.gymGoal.create({
    data: {
      userId,
      calorieTarget: Number(calorieTarget || 2200),
      proteinTarget: Number(proteinTarget || 150),
      carbsTarget: Number(carbsTarget || 250),
      fatsTarget: Number(fatsTarget || 70),
      waterTarget: Number(waterTarget || 2500),
      isActive: true,
    },
  });
};

/**
 * Fetches the active gym goal for a user.
 */
export const getGymGoal = async (userId: string) => {
  const goal = await prisma.gymGoal.findFirst({
    where: { userId, isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return goal;
};

/**
 * Adds a meal to the daily nutrition log.
 * Automatically creates a log for the day if it doesn't exist and updates totals.
 */
export const addMeal = async (userId: string, mealData: any) => {
  const { name, calories, protein, carbs, fats, imageUrl, date } = mealData;
  
  // Normalize date to YYYY-MM-DD 00:00:00 to match unique constraint
  const logDate = date ? new Date(date) : new Date();
  logDate.setHours(0, 0, 0, 0);

  // 1. Find or Create Daily Log
  let log = await prisma.dailyNutritionLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: logDate,
      },
    },
  });

  if (!log) {
    log = await prisma.dailyNutritionLog.create({
      data: {
        userId,
        date: logDate,
      },
    });
  }

  // 2. Add Meal
  const meal = await prisma.meal.create({
    data: {
      logId: log.id,
      name,
      calories: Number(calories || 0),
      protein: Number(protein || 0),
      carbs: Number(carbs || 0),
      fats: Number(fats || 0),
      imageUrl,
    },
  });

  // 3. Update Log Totals
  const updatedLog = await prisma.dailyNutritionLog.update({
    where: { id: log.id },
    data: {
      totalCalories: { increment: Number(calories || 0) },
      totalProtein: { increment: Number(protein || 0) },
      totalCarbs: { increment: Number(carbs || 0) },
      totalFats: { increment: Number(fats || 0) },
    },
    include: { meals: true },
  });

  return { meal, log: updatedLog };
};

/**
 * Fetches nutrition log for a specific date.
 */
export const getDailyLog = async (userId: string, dateStr?: string) => {
  const logDate = dateStr ? new Date(dateStr) : new Date();
  logDate.setHours(0, 0, 0, 0);

  const log = await prisma.dailyNutritionLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: logDate,
      },
    },
    include: { meals: true },
  });

  return log;
};

/**
 * Logs water consumption.
 */
export const logWater = async (userId: string, amount: number) => {
  const water = await prisma.waterLog.create({
    data: {
      userId,
      amount: Number(amount),
    },
  });
  return water;
};

/**
 * Fetches total water consumed for a day.
 */
export const getDailyWater = async (userId: string, dateStr?: string) => {
  const startOfDay = dateStr ? new Date(dateStr) : new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  const logs = await prisma.waterLog.findMany({
    where: {
      userId,
      timestamp: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const totalAmount = logs.reduce((sum, log) => sum + log.amount, 0);
  
  return { totalAmount, logs };
};

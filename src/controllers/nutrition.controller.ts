import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import type { NextFunction, Response } from "express";
import { googleGenAIModel, groqModel } from "../ai/llm/model";
import {
  foodScanPrompt,
  nutritionAssistantPrompt,
  plannerAssessmentPrompt,
  plannerGenerationPrompt,
} from "../ai/llm/prompt";
import {
  assessmentOutputSchema,
  nutritionOutputSchema,
  planOutputSchema,
} from "../ai/schema/nutrition.schema";
import { uploadOnCloudinary } from "../config/cloudinary";
import { prisma } from "../config/prisma";
import { statusCodes, type User } from "../types/types";
import { SuccessResponse } from "../utils/response.utils";
import { type ScanFoodSchemaType } from "../validators/nutrition.validator";

export const scanFoodController = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { image: rawImage, mealType } = req.body as ScanFoodSchemaType;
    const user = req.user as User;

    // Strip the Data URL prefix (e.g., "data:image/jpeg;base64,") if it exists
    const image = rawImage.replace(/^data:image\/\w+;base64,/, "");

    // 1. Invoke Vision Model for Analysis FIRST (Using base64 image)
    const modelWithStructuredOutput = googleGenAIModel.withStructuredOutput(
      nutritionOutputSchema,
    );

    const aiResponse = await modelWithStructuredOutput.invoke([
      foodScanPrompt,
      new HumanMessage({
        content: [
          {
            type: "text",
            text: "Analyze this food image and provide detailed nutritional information.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${image}`,
            },
          },
        ],
      }),
    ]);

    // 2. Upload image to Cloudinary ONLY IF AI analysis succeeded
    const cloudinaryResult = await uploadOnCloudinary(image, "nutrition_scans");

    // 3. Save to Database
    const nutritionLog = await prisma.nutritionLog.create({
      data: {
        userId: user.id, // User ID is BigInt
        name: aiResponse.name,
        servingSize: aiResponse.servingSize,
        calories: aiResponse.calories,
        protein: aiResponse.protein,
        carbs: aiResponse.carbs,
        fats: aiResponse.fats,
        fiber: aiResponse.fiber,
        sugar: aiResponse.sugar,
        sodium: aiResponse.sodium,
        cholesterol: aiResponse.cholesterol,
        vitaminA: aiResponse.vitaminA,
        vitaminC: aiResponse.vitaminC,
        vitaminB6: aiResponse.vitaminB6,
        iron: aiResponse.iron,
        potassium: aiResponse.potassium,
        calcium: aiResponse.calcium,
        healthScore: aiResponse.healthScore,
        imageUrl: cloudinaryResult.url,
        tags: aiResponse.tags,
        mealType: mealType as any,
      },
    });

    // 4. Return Response
    return res.status(statusCodes.SUCCESS).json(SuccessResponse(
      "Food scanned and logged successfully",
      {
        ...aiResponse,
        imageUrl: cloudinaryResult,
        id: nutritionLog.id,
        mealType: nutritionLog.mealType,
        createdAt: nutritionLog.createdAt,
      },
      statusCodes.SUCCESS,
      "FOOD_SCANNED_SUCCESSFULLY",
    ));
  } catch (error) {
    next(error);
  }
};

export const chatWithNutritionist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { messages } = req.body as { messages: { role: "user" | "assistant"; content: string }[] };
    const user = req.user as User;

    // Initialize history with the system prompt
    const history: BaseMessage[] = [nutritionAssistantPrompt];

    // Map the incoming client-side history to LangChain message types
    messages.forEach((msg: any) => {
      if (msg.role === "user") {
        history.push(new HumanMessage(msg.content));
      } else if (msg.role === "assistant") {
        history.push(new AIMessage(msg.content));
      }
    });

    // Invoke the AI model with the full history
    const response = await groqModel.invoke(history);

    return res.status(statusCodes.SUCCESS).json(SuccessResponse(
      "Chat response",
      response.content,
      statusCodes.SUCCESS,
      "CHAT_RESPONSE"
    ));
  } catch (error) {
    next(error);
  }
};

export const generatePlanQuestions = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { goal, description } = req.body as { goal: string; description?: string };
    const user = req.user as User;

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
    });

    const modelWithStructuredOutput = googleGenAIModel.withStructuredOutput(
      assessmentOutputSchema
    );

    const aiResponse = await modelWithStructuredOutput.invoke([
      plannerAssessmentPrompt,
      new HumanMessage(`
        Goal: ${goal}
        Description: ${description || "None provided"}
        
        User Profile (Already Known):
        ${userProfile ? JSON.stringify({
          age: userProfile.age,
          gender: userProfile.gender,
          height: userProfile.height,
          weight: userProfile.weight,
          activityLevel: userProfile.activityLevel,
          dietaryPreferences: userProfile.dietaryPreferences,
          allergies: userProfile.allergies,
          healthGoals: userProfile.healthGoals,
        }, null, 2) : "None provided"}
        
        IMPORTANT: Generate questions to ask for information that is NOT in the profile above.
      `),
    ]);

    return res.status(statusCodes.SUCCESS).json(SuccessResponse(
      "Assessment questions generated",
      aiResponse.questions,
      statusCodes.SUCCESS,
      "QUESTIONS_GENERATED"
    ));
  } catch (error) {
    next(error);
  }
};

export const generateFullPlan = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { goal, description, answers } = req.body as {
      goal: string;
      description?: string;
      answers: { questionId: string; questionText: string; answer: string }[];
    };
    const user = req.user as User;

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
    });

    const modelWithStructuredOutput =
      googleGenAIModel.withStructuredOutput(planOutputSchema);

    const aiResponse = await modelWithStructuredOutput.invoke([
      plannerGenerationPrompt,
      new HumanMessage(`
        Goal: ${goal}
        Description: ${description || "None provided"}
        
        User Profile:
        ${userProfile ? JSON.stringify({
          age: userProfile.age,
          gender: userProfile.gender,
          height: userProfile.height,
          weight: userProfile.weight,
          activityLevel: userProfile.activityLevel,
          dietaryPreferences: userProfile.dietaryPreferences,
          allergies: userProfile.allergies,
          healthGoals: userProfile.healthGoals,
        }, null, 2) : "None provided"}
        
        User Assessment Answers:
        ${answers.map((a: any) => `Q: ${a.questionText}\nA: ${a.answer}`).join("\n\n")}
      `),
    ]);

    // Save to Database
    const plan = await prisma.transformationPlan.create({
      data: {
        userId: user.id,
        goal,
        description,
        durationDays: aiResponse.durationDays,
        dailyCalories: aiResponse.dailyCalories,
        proteinGrams: aiResponse.proteinGrams,
        carbsGrams: aiResponse.carbsGrams,
        fatsGrams: aiResponse.fatsGrams,
        assessment: answers as any,
        dietSchedule: aiResponse.dietPlan as any,
        workoutRoutine: aiResponse.workoutPlan as any,
        guidelines: aiResponse.guidelines as any,
      },
    });

    return res.status(statusCodes.SUCCESS).json(SuccessResponse(
      "Transformation plan generated and saved",
      plan,
      statusCodes.SUCCESS,
      "PLAN_GENERATED"
    ));
  } catch (error) {
    next(error);
  }
};

export const getCurrentPlan = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const plan = await prisma.transformationPlan.findFirst({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(statusCodes.SUCCESS).json(SuccessResponse(
      "Current plan retrieved",
      plan,
      statusCodes.SUCCESS,
      "PLAN_RETRIEVED"
    ));
  } catch (error) {
    next(error);
  }
};

export const getAllNutritionLogs = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const query = req.query as {
      page?: string;
      limit?: string;
      startDate?: string;
      endDate?: string;
    };
    
    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "10");
    const skip = (page - 1) * limit;

    const where: any = {
      userId: user.id,
    };

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        where.createdAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.createdAt.lte = new Date(query.endDate);
      }
    }

    const [logs, total] = await Promise.all([
      prisma.nutritionLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.nutritionLog.count({ where }),
    ]);

    return res.status(statusCodes.SUCCESS).json(SuccessResponse(
      "Nutrition logs retrieved successfully",
      {
        logs,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          page,
          limit,
        },
      },
      statusCodes.SUCCESS,
      "NUTRITION_LOGS_RETRIEVED"
    ));
  } catch (error) {
    next(error);
  }
};

export const getAllPlans = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const query = req.query as {
      page?: string;
      limit?: string;
    };

    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "10");
    const skip = (page - 1) * limit;

    const where = {
      userId: user.id,
    };

    const [plans, total] = await Promise.all([
      prisma.transformationPlan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.transformationPlan.count({ where }),
    ]);

    return res.status(statusCodes.SUCCESS).json(SuccessResponse(
      "Transformation plans retrieved successfully",
      {
        plans,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          page,
          limit,
        },
      },
      statusCodes.SUCCESS,
      "PLANS_RETRIEVED"
    ));
  } catch (error) {
    next(error);
  }
};

export const getDashboardData = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    // 1. Get Current Plan for Goals
    const activePlan = await prisma.transformationPlan.findFirst({
      where: { userId: user.id, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    const goals = {
      calories: activePlan?.dailyCalories || 2000,
      protein: activePlan?.proteinGrams || 150,
      carbs: activePlan?.carbsGrams || 250,
      fats: activePlan?.fatsGrams || 65,
    };

    // 2. Today's Intake
    const todayLogs = await prisma.nutritionLog.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: todayStart },
      },
    });

    const todayIntake = todayLogs.reduce(
      (acc: any, log: any) => ({
        calories: acc.calories + (log.calories || 0),
        protein: acc.protein + (log.protein || 0),
        carbs: acc.carbs + (log.carbs || 0),
        fats: acc.fats + (log.fats || 0),
        fiber: acc.fiber + (log.fiber || 0),
        vitaminC: acc.vitaminC + (log.vitaminC || 0),
        iron: acc.iron + (log.iron || 0),
        calcium: acc.calcium + (log.calcium || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, vitaminC: 0, iron: 0, calcium: 0 }
    );

    // 3. Weekly Performance (Last 7 Days)
    const last7DaysLogs = await prisma.nutritionLog.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: weekStart },
      },
    });

    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dStr = d.toLocaleDateString("en-US", { weekday: "short" });
      const dStart = new Date(d); dStart.setHours(0, 0, 0, 0);
      const dEnd = new Date(d); dEnd.setHours(23, 59, 59, 999);
      
      const dayCalories = last7DaysLogs
        .filter((l: any) => l.createdAt >= dStart && l.createdAt <= dEnd)
        .reduce((sum: number, l: any) => sum + (l.calories || 0), 0);
        
      weeklyData.push({ day: dStr, calories: dayCalories, goal: goals.calories });
    }

    // 4. Recent Logs (Top 4)
    const recentMeals = await prisma.nutritionLog.findMany({
      where: { userId: user.id },
      take: 4,
      orderBy: { createdAt: "desc" },
    });

    // 5. Streak & Protein Average
    const avgProtein = last7DaysLogs.length > 0 
      ? Math.round(last7DaysLogs.reduce((sum: number, l: any) => sum + (l.protein || 0), 0) / 7) 
      : 0;

    // Streak Calculation
    const last30DaysLogs = await prisma.nutritionLog.findMany({
      where: { userId: user.id, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    
    const logDates = new Set(last30DaysLogs.map((l: any) => l.createdAt.toDateString()));
    let streak = 0;
    let curr = new Date();
    while (logDates.has(curr.toDateString())) {
      streak++;
      curr.setDate(curr.getDate() - 1);
    }

    return res.status(statusCodes.SUCCESS).json(SuccessResponse("Dashboard data retrieved successfully", {
      dailyStats: {
        calories: { current: Math.round(todayIntake.calories), goal: goals.calories, unit: "kcal" },
        protein: { current: Math.round(todayIntake.protein), goal: goals.protein, unit: "g" },
        carbs: { current: Math.round(todayIntake.carbs), goal: goals.carbs, unit: "g" },
        fats: { current: Math.round(todayIntake.fats), goal: goals.fats, unit: "g" },
      },
      weeklyData,
      recentMeals: recentMeals.map((m: any) => ({
        id: m.id,
        name: m.name,
        time: m.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        calories: Math.round(m.calories),
        protein: Math.round(m.protein),
        emoji: m.mealType === "BREAKFAST" ? "🥣" : m.mealType === "LUNCH" ? "🥗" : m.mealType === "DINNER" ? "🍽️" : "🥤"
      })),
      nutrientHighlights: [
        { name: "Fiber", amount: `${Math.round(todayIntake.fiber)}g`, target: "25g", color: "from-amber-400 to-orange-500" },
        { name: "Vitamin C", amount: `${Math.round(todayIntake.vitaminC)}mg`, target: "90mg", color: "from-yellow-400 to-amber-500" },
        { name: "Iron", amount: `${Math.round(todayIntake.iron)}mg`, target: "18mg", color: "from-red-400 to-rose-500" },
        { name: "Calcium", amount: `${Math.round(todayIntake.calcium)}mg`, target: "1000mg", color: "from-blue-400 to-indigo-500" },
      ],
      quickStats: [
         { label: "Avg Daily Protein", value: `${avgProtein}g`, change: "+5%", trend: "up" },
         { label: "Meals Logged", value: last7DaysLogs.length, change: "This week", trend: "neutral" },
         { label: "Best Streak", value: `${streak} days`, change: "Current", trend: "up" },
         { label: "Calorie Deficit", value: todayIntake.calories > goals.calories ? `+${Math.round(todayIntake.calories - goals.calories)}` : `${Math.round(todayIntake.calories - goals.calories)}`, change: "kcal/day", trend: todayIntake.calories > goals.calories ? "up" : "down" }
      ]
    }));
  } catch (error) {
    next(error);
  }
};



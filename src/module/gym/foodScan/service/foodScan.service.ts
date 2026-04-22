import { prisma } from "../../../../config/prisma";
import { AppError } from "../../../../utils/AppError";

/**
 * Simulates AI Food Recognition.
 * In a real app, you would call Gemini or a Vision API here.
 */
export const analyzeFoodImage = async (imageLink: string) => {
  // --- START MOCK AI LOGIC ---
  // We simulate detection. Replace 'car' or 'dog' image keywords with real AI checks.
  const isFood = !imageLink.toLowerCase().includes("car") && !imageLink.toLowerCase().includes("dog");

  if (!isFood) {
    throw new AppError(400, "The scanned image is not recognized as food. Please scan a food item.");
  }

  // Mock nutritional data extraction (Simulating AI response)
  return {
    productName: "Healthy Food Item", // AI identifies name
    scanType: "FOOD",
    safetyScore: 88,
    ingredients: [
      { name: "Proteins", amount: "25g", status: "Healthy" },
      { name: "Fats", amount: "10g", status: "Moderate" },
      { name: "Carbs", amount: "40g", status: "Healthy" },
      { name: "Fiber", amount: "5g", status: "Very Healthy" }
    ]
  };
  // --- END MOCK AI LOGIC ---
};

/**
 * Creates a new product scan record.
 */
export const createProductScan = async (userId: string, data: any) => {
  const scan = await prisma.productScan.create({
    data: {
      userId,
      productName: data.productName,
      scanType: "FOOD",
      safetyScore: Number(data.safetyScore),
      ingredients: data.ingredients || [],
    },
  });

  return scan;
};

/**
 * Fetches all product scans for a specific user.
 */
export const getUserScans = async (userId: string) => {
  const scans = await prisma.productScan.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
  });
  return scans;
};

/**
 * Fetches details for a single product scan.
 */
export const getScanById = async (scanId: string) => {
  const scan = await prisma.productScan.findUnique({
    where: { id: scanId },
  });
  return scan;
};

/**
 * Deletes a product scan record.
 */
export const deleteProductScan = async (scanId: string) => {
  await prisma.productScan.delete({
    where: { id: scanId },
  });
  return true;
};

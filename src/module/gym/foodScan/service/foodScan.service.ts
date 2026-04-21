import { prisma } from "../../../../config/prisma";

/**
 * Creates a new product scan record.
 */
export const createProductScan = async (userId: string, scanData: any) => {
  const { productName, scanType, safetyScore, ingredients } = scanData;

  const scan = await prisma.productScan.create({
    data: {
      userId,
      productName,
      scanType,
      safetyScore: Number(safetyScore),
      ingredients: ingredients || [], // Store JSON array
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

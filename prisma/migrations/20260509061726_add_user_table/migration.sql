/*
  Warnings:

  - You are about to drop the `Achievement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyNutritionLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GymGoal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductScan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoutineLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SkincareMetric` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAchievement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WaterLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_roomId_fkey";

-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_userId_fkey";

-- DropForeignKey
ALTER TABLE "DailyNutritionLog" DROP CONSTRAINT "DailyNutritionLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "GymGoal" DROP CONSTRAINT "GymGoal_userId_fkey";

-- DropForeignKey
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_logId_fkey";

-- DropForeignKey
ALTER TABLE "ProductScan" DROP CONSTRAINT "ProductScan_userId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "RoutineLog" DROP CONSTRAINT "RoutineLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "SkincareMetric" DROP CONSTRAINT "SkincareMetric_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_achievementId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_userId_fkey";

-- DropForeignKey
ALTER TABLE "WaterLog" DROP CONSTRAINT "WaterLog_userId_fkey";

-- DropTable
DROP TABLE "Achievement";

-- DropTable
DROP TABLE "ChatMessage";

-- DropTable
DROP TABLE "ChatRoom";

-- DropTable
DROP TABLE "DailyNutritionLog";

-- DropTable
DROP TABLE "GymGoal";

-- DropTable
DROP TABLE "Meal";

-- DropTable
DROP TABLE "ProductScan";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "RoutineLog";

-- DropTable
DROP TABLE "SkincareMetric";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserAchievement";

-- DropTable
DROP TABLE "WaterLog";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "ModuleType";

-- DropEnum
DROP TYPE "ScanType";

-- DropEnum
DROP TYPE "SenderType";

-- DropEnum
DROP TYPE "SkinType";

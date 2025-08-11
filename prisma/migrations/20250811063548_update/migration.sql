/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Category` table. All the data in the column will be lost.
  - The `id` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `processedById` on the `StockRequest` table. All the data in the column will be lost.
  - You are about to drop the column `quantityChange` on the `StockRequest` table. All the data in the column will be lost.
  - You are about to drop the column `requestedById` on the `StockRequest` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name,categoryId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `categoryId` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `sku` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `quantity` to the `StockRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestedBy` to the `StockRequest` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `StockRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."StockType" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "public"."ActionType" AS ENUM ('USER_LOGIN', 'USER_CREATED', 'PRODUCT_CREATED', 'STOCK_REQUEST_CREATED', 'STOCK_REQUEST_APPROVED', 'STOCK_REQUEST_REJECTED');

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockRequest" DROP CONSTRAINT "StockRequest_processedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockRequest" DROP CONSTRAINT "StockRequest_requestedById_fkey";

-- AlterTable
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "description" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "description",
ADD COLUMN     "costPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "dimensions" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "reorderLevel" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "sellingPrice" DECIMAL(10,2),
ADD COLUMN     "supplierId" INTEGER,
ADD COLUMN     "weight" DOUBLE PRECISION,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ALTER COLUMN "sku" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."StockRequest" DROP COLUMN "processedById",
DROP COLUMN "quantityChange",
DROP COLUMN "requestedById",
ADD COLUMN     "approvedBy" INTEGER,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "requestedBy" INTEGER NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "public"."StockType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "emailVerified",
DROP COLUMN "image",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "public"."RequestType";

-- DropEnum
DROP TYPE "public"."UserRole";

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" SERIAL NOT NULL,
    "action" "public"."ActionType" NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contactInfo" TEXT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "public"."Supplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_categoryId_key" ON "public"."Product"("name", "categoryId");

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockRequest" ADD CONSTRAINT "StockRequest_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockRequest" ADD CONSTRAINT "StockRequest_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `costPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `dimensions` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `reorderLevel` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Product` table. All the data in the column will be lost.
  - The `id` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `StockRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `approvedBy` on the `StockRequest` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `StockRequest` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `StockRequest` table. All the data in the column will be lost.
  - The `id` column on the `StockRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `StockRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `StockRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `StockRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."StockRequestType" AS ENUM ('STOCK_IN', 'STOCK_OUT');

-- CreateEnum
CREATE TYPE "public"."StockRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockRequest" DROP CONSTRAINT "StockRequest_approvedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockRequest" DROP CONSTRAINT "StockRequest_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockRequest" DROP CONSTRAINT "StockRequest_requestedBy_fkey";

-- DropIndex
DROP INDEX "public"."Product_name_categoryId_key";

-- DropIndex
DROP INDEX "public"."Product_sku_key";

-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "costPrice",
DROP COLUMN "dimensions",
DROP COLUMN "reorderLevel",
DROP COLUMN "sellingPrice",
DROP COLUMN "sku",
DROP COLUMN "supplierId",
DROP COLUMN "weight",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."StockRequest" DROP CONSTRAINT "StockRequest_pkey",
DROP COLUMN "approvedBy",
DROP COLUMN "notes",
DROP COLUMN "updatedAt",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "public"."StockRequestType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."StockRequestStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "StockRequest_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."Account";

-- DropTable
DROP TABLE "public"."AuditLog";

-- DropTable
DROP TABLE "public"."Session";

-- DropTable
DROP TABLE "public"."Supplier";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."VerificationToken";

-- DropEnum
DROP TYPE "public"."ActionType";

-- DropEnum
DROP TYPE "public"."RequestStatus";

-- DropEnum
DROP TYPE "public"."Role";

-- DropEnum
DROP TYPE "public"."StockType";

-- AddForeignKey
ALTER TABLE "public"."StockRequest" ADD CONSTRAINT "StockRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

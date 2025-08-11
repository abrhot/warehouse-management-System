/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `location` on the `Product` table. All the data in the column will be lost.
  - The primary key for the `StockRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `quantity` on the `StockRequest` table. All the data in the column will be lost.
  - You are about to drop the column `requestedBy` on the `StockRequest` table. All the data in the column will be lost.
  - The `status` column on the `StockRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityChange` to the `StockRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestedById` to the `StockRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StockRequest` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `StockRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."RequestType" AS ENUM ('STOCK_IN', 'STOCK_OUT');

-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockRequest" DROP CONSTRAINT "StockRequest_productId_fkey";

-- AlterTable
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Category_id_seq";

-- AlterTable
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "location",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "sku" TEXT,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Product_id_seq";

-- AlterTable
ALTER TABLE "public"."StockRequest" DROP CONSTRAINT "StockRequest_pkey",
DROP COLUMN "quantity",
DROP COLUMN "requestedBy",
ADD COLUMN     "processedById" TEXT,
ADD COLUMN     "quantityChange" INTEGER NOT NULL,
ADD COLUMN     "requestedById" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "public"."RequestType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "StockRequest_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StockRequest_id_seq";

-- DropEnum
DROP TYPE "public"."StockRequestStatus";

-- DropEnum
DROP TYPE "public"."StockRequestType";

-- CreateTable
CREATE TABLE "public"."LedgerEntry" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "change" INTEGER NOT NULL,
    "newQuantity" INTEGER NOT NULL,
    "stockRequestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LedgerEntry_stockRequestId_key" ON "public"."LedgerEntry"("stockRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "public"."Product"("sku");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockRequest" ADD CONSTRAINT "StockRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockRequest" ADD CONSTRAINT "StockRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockRequest" ADD CONSTRAINT "StockRequest_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LedgerEntry" ADD CONSTRAINT "LedgerEntry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LedgerEntry" ADD CONSTRAINT "LedgerEntry_stockRequestId_fkey" FOREIGN KEY ("stockRequestId") REFERENCES "public"."StockRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

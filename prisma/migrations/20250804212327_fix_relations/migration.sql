/*
  Warnings:

  - The `approvedBy` column on the `StockRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `requestedBy` on the `StockRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."StockRequest" DROP CONSTRAINT "StockRequest_approvedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockRequest" DROP CONSTRAINT "StockRequest_requestedBy_fkey";

-- AlterTable
ALTER TABLE "public"."StockRequest" DROP COLUMN "requestedBy",
ADD COLUMN     "requestedBy" INTEGER NOT NULL,
DROP COLUMN "approvedBy",
ADD COLUMN     "approvedBy" INTEGER;

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."StockRequest" ADD CONSTRAINT "StockRequest_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockRequest" ADD CONSTRAINT "StockRequest_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

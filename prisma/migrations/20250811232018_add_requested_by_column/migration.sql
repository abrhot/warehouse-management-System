/*
  Warnings:

  - The primary key for the `AuditLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `StockRequest` table. All the data in the column will be lost.
  - You are about to drop the column `requestedBy` on the `StockRequest` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `user_id` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requested_by` to the `StockRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockRequest" DROP CONSTRAINT "StockRequest_approvedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockRequest" DROP CONSTRAINT "StockRequest_requestedBy_fkey";

-- AlterTable
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_pkey",
DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AuditLog_id_seq";

-- AlterTable
ALTER TABLE "public"."StockRequest" DROP COLUMN "approvedBy",
DROP COLUMN "requestedBy",
ADD COLUMN     "approved_by" TEXT,
ADD COLUMN     "requested_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockRequest" ADD CONSTRAINT "StockRequest_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockRequest" ADD CONSTRAINT "StockRequest_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

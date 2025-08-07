/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,category]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "costPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "reorderLevel" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "sellingPrice" DECIMAL(65,30),
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "supplier" TEXT;

-- AlterTable
ALTER TABLE "public"."StockRequest" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reason" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "public"."Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_category_key" ON "public"."Product"("name", "category");

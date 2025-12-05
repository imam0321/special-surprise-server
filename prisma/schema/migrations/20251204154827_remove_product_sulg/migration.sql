/*
  Warnings:

  - You are about to drop the column `slug` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."products_slug_key";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "slug";

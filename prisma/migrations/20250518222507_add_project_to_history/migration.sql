/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PromptHistory" DROP CONSTRAINT "PromptHistory_userId_fkey";

-- AlterTable
ALTER TABLE "PromptHistory" ADD COLUMN     "project" TEXT NOT NULL DEFAULT 'default';

-- DropTable
DROP TABLE "User";
